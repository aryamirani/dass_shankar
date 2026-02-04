const CONDITIONS = [
  {
    id: 'cold', img: '/GradeX2/health/Problems/boysneeze.png', title: 'Cold',
    lines: [
      'I feel warm, can you check my temperature?',
      'My nose is running, I need to wipe it.',
      'A warm drink makes my chest feel better.'
    ], items: ['thermometer', 'tissue', 'hotdrink']
  },
  {
    id: 'fever', img: '/GradeX2/health/Problems/boyfever.png', title: 'Fever',
    lines: [
      'I feel very hot, please check my temperature.',
      'I need some medicine to bring the fever down.',
      'A hot drink will help me sweat it out.'
    ], items: ['thermometer', 'medicine', 'hotdrink']
  },
  {
    id: 'cough', img: '/GradeX2/health/Problems/boycough.png', title: 'Cough',
    lines: [
      'My throat is scratchy, I need some syrup.',
      'A warm drink soothes my throat.'
    ], items: ['hotdrink', 'medicine']
  },
  {
    id: 'headache', img: '/GradeX2/health/Problems/boyheadache.png', title: 'Headache',
    lines: [
      'My head hurts, I need something for the pain.',
      'A warm tea might help me relax.'
    ], items: ['medicine', 'hotdrink']
  },
  {
    id: 'toothache', img: '/GradeX2/health/Problems/boytooth.png', title: 'Toothache',
    lines: [
      'My tooth hurts, I need pain medicine.',
      'Let\'s check the first aid box for gel.'
    ], items: ['medicine', 'firstaid']
  },
  {
    id: 'earache', img: '/GradeX2/health/Problems/boyear.png', title: 'Earache',
    lines: [
      'My ear hurts, do we have ear drops?',
      'I feel warm too, check if I have a fever.'
    ], items: ['medicine', 'thermometer']
  },
  {
    id: 'eye', img: '/GradeX2/health/Problems/boyeye.png', title: 'Eye Infection',
    lines: [
      'My eyes are itchy, I need eye drops.',
      'A clean wet cloth helps wipe them.',
      'First aid kit has eye wipes.'
    ], items: ['medicine', 'wetcloth', 'firstaid']
  },
  {
    id: 'vomiting', img: '/GradeX2/health/Problems/boyvomit.png', title: 'Vomiting',
    lines: [
      'I feel sick, I need medicine to stop it.',
      'I need tissues to wipe my mouth.'
    ], items: ['medicine', 'tissue']
  },
  {
    id: 'diarrhea', img: '/GradeX2/health/Problems/boypotty.png', title: 'Diarrhea',
    lines: [
      'My tummy hurts, I need medicine.',
      'I need to use the toilet again!',
      'A wet cloth keeps me clean.'
    ], items: ['medicine', 'toilet', 'wetcloth']
  },
  {
    id: 'skin', img: '/GradeX2/health/Problems/boyskin.png', title: 'Skin Allergy',
    lines: [
      'My skin is itchy, I need some cream.',
      'A cool wet cloth stops the itching.',
      'Look in the first aid box for lotion.'
    ], items: ['medicine', 'wetcloth', 'firstaid']
  },
  {
    id: 'stomach', img: '/GradeX2/health/Problems/boystomach.png', title: 'Stomach Pain',
    lines: [
      'My tummy aches, I need medicine.',
      'Warm water helps the pain go away.'
    ], items: ['medicine', 'hotdrink']
  },
  {
    id: 'throat', img: '/GradeX2/health/Problems/boythroat.png', title: 'Throat Pain',
    lines: [
      'It hurts to swallow, I need medicine.',
      'A hot drink feels good on my throat.'
    ], items: ['medicine', 'hotdrink']
  }
]

export default CONDITIONS
