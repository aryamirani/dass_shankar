const CONDITIONS = [
  {
    id: 'cold', img: '/assets/boysneeze.png', title: 'Cold',
    lines: [
      'I am sneezing.',
      'I have a cold.',
      'My nose is runny.',
      'I feel cold.',
      'I want a blanket.',
      'I should go to a doctor.'
    ]
    , items: ['thermometer','tissue','facemask','hotdrink']
  },
  {
    id: 'fever', img: '/assets/boyfever.png', title: 'Fever',
    lines: [
      'I have a fever.',
      'My body feels hot.',
      'My body is warm.',
      'I have a headache.',
      'My muscles hurt.',
      'I should rest and see a doctor.'
    ], items: ['thermometer','medicine','facemask','bed','hotdrink']
  },
  {
    id: 'cough', img: '/assets/boycough.png', title: 'Cough',
    lines: [
      'I am coughing.',
      'My throat feels itchy.',
      'I feel uncomfortable.',
      'I should cover my mouth.',
      'I should drink warm water.'
    ], items: ['facemask','hotdrink','medicine']
  },
  {
    id: 'headache', img: '/assets/boyheadache.png', title: 'Headache',
    lines: [
      'My head hurts.',
      'I feel pain in my head.',
      'Bright light hurts my eyes.',
      'I want to rest.',
      'I should tell an adult.'
    ], items: ['medicine','bed','hotdrink']
  },
  {
    id: 'toothache', img: '/assets/boytooth.png', title: 'Toothache',
    lines: [
      'My tooth hurts.',
      'My cheek hurts.',
      'It hurts when I eat.',
      'I feel pain in my mouth.',
      'I should go to the dentist.'
    ], items: ['medicine','firstaid']
  },
  {
    id: 'earache', img: '/assets/boyear.png', title: 'Earache',
    lines: [
      'My ear hurts.',
      'I feel pain inside my ear.',
      'Sounds feel loud.',
      'I feel uncomfortable.',
      'I should see a doctor.'
    ], items: ['medicine','thermometer']
  },
  {
    id: 'eye', img: '/assets/boyeye.png', title: 'Eye Infection',
    lines: [
      'My eyes are red.',
      'My eyes feel itchy.',
      'My eyes hurt.',
      'I should not touch my eyes.',
      'I should see a doctor.'
    ], items: ['medicine','wetcloth','firstaid']
  },
  {
    id: 'vomiting', img: '/assets/boyvomit.png', title: 'Vomiting',
    lines: [
      'I feel sick.',
      'My stomach feels bad.',
      'I am vomiting.',
      'I feel weak.',
      'I should rest and drink water.'
    ], items: ['medicine','tissue']
  },
  {
    id: 'diarrhea', img: '/assets/boypotty.png', title: 'Diarrhea',
    lines: [
      'My stomach hurts.',
      'I need to use the toilet.',
      'My tummy feels upset.',
      'I feel uncomfortable.',
      'I should drink water and rest.'
    ], items: ['medicine','toilet','wetcloth']
  },
  {
    id: 'skin', img: '/assets/boyskin.png', title: 'Skin Allergy',
    lines: [
      'My skin feels itchy.',
      'I see red spots.',
      'My skin hurts.',
      'I am scratching.',
      'I should tell an adult.'
    ], items: ['medicine','wetcloth','firstaid']
  },
  {
    id: 'stomach', img: '/assets/boystomach.png', title: 'Stomach Pain',
    lines: [
      'My stomach hurts.',
      'I feel pain in my tummy.',
      'I feel uncomfortable.',
      'I want to lie down.',
      'I should tell someone.'
    ], items: ['medicine','bed','hotdrink']
  },
  {
    id: 'throat', img: '/assets/boythroat.png', title: 'Throat Pain',
    lines: [
      'My throat hurts.',
      'It hurts when I swallow.',
      'My throat feels sore.',
      'I should drink warm water.',
      'I should see a doctor.'
    ], items: ['medicine','hotdrink','facemask']
  }
]

export default CONDITIONS
