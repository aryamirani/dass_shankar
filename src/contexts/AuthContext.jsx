import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [approvalStatus, setApprovalStatus] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchUserRole(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchUserRole(session.user.id)
            } else {
                setRole(null)
                setApprovalStatus(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    const fetchUserRole = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .single()

            if (error) throw error
            setRole(data?.role || null)

            // If teacher, check approval status
            if (data?.role === 'teacher') {
                const { data: teacherData, error: teacherError } = await supabase
                    .from('teachers')
                    .select('approval_status')
                    .eq('user_id', userId)
                    .single()

                if (teacherError) throw teacherError
                setApprovalStatus(teacherData?.approval_status || 'pending')
            } else {
                setApprovalStatus(null)
            }
        } catch (error) {
            console.error('Error fetching user role:', error)
            setRole(null)
            setApprovalStatus(null)
        } finally {
            setLoading(false)
        }
    }

    const signUp = async (email, password, roleType, fullName, phoneNumber = '', studentDetails = null) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            // Create role entry
            if (data.user) {
                const { error: roleError } = await supabase
                    .from('user_roles')
                    .insert([{ user_id: data.user.id, role: roleType }])

                if (roleError) throw roleError

                // Create teacher or parent entry
                if (roleType === 'teacher') {
                    const { error: teacherError } = await supabase
                        .from('teachers')
                        .insert([{
                            user_id: data.user.id,
                            email: email,
                            full_name: fullName || email.split('@')[0],
                            phone: phoneNumber
                        }])
                    if (teacherError) throw teacherError
                } else if (roleType === 'parent') {
                    // Create parent entry
                    const { data: parentData, error: parentError } = await supabase
                        .from('parents')
                        .insert([{
                            user_id: data.user.id,
                            email: email,
                            full_name: fullName || email.split('@')[0],
                            phone: phoneNumber
                        }])
                        .select()
                        .single()

                    if (parentError) throw parentError

                    // Create parent request
                    if (studentDetails && parentData) {
                        const { error: requestError } = await supabase
                            .from('parent_requests')
                            .insert([{
                                parent_id: parentData.id,
                                student_name: studentDetails.name,
                                student_roll_no: studentDetails.rollNo,
                                grade_name: studentDetails.grade,
                                status: 'pending'
                            }])

                        if (requestError) throw requestError
                    }
                }
            }

            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    const signIn = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            return { data: null, error }
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            setUser(null)
            setRole(null)
        }
        return { error }
    }

    const value = {
        user,
        role,
        approvalStatus,
        loading,
        signUp,
        signIn,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
