const CONDITIONS = [
  {
    id: 'cold', img: '/assets/boysneeze.png', title: 'Cold',
    lines: [
      'I can\'t stop sneezing and my nose keeps running — I keep wiping it.',
      'I feel a little warm; I wish someone could tell me how hot I am.',
      'When I cough, I want to cover my mouth so others don\'t get sick.',
      'A warm cup would make my chest feel calmer.'
    ], items: ['thermometer','tissue','hotdrink']
  },
  {
    id: 'fever', img: '/assets/boyfever.png', title: 'Fever',
    lines: [
      'My body feels very hot and I feel really tired.',
      'I feel shaky and a small sip of something warm might make me feel better.',
      'I wish I could know exactly how hot I am and get something to help with the pain.'
    ], items: ['thermometer','medicine','hotdrink']
  },
  {
    id: 'cough', img: '/assets/boycough.png', title: 'Cough',
    lines: [
      'My chest keeps making a coughy sound and my throat feels scratchy.',
      'A warm drink helps my throat feel softer for a little while.',
      'When I cough I want to make sure my mouth is covered so droplets stay inside.'
    ], items: ['hotdrink','medicine']
  },
  {
    id: 'headache', img: '/assets/boyheadache.png', title: 'Headache',
    lines: [
      'My head feels heavy and bright lights bother me.',
      'A little rest and something gentle might take the edge off the pain.',
      'A warm drink makes my head feel a bit calmer.'
    ], items: ['medicine','hotdrink']
  },
  {
    id: 'toothache', img: '/assets/boytooth.png', title: 'Toothache',
    lines: [
      'My tooth hurts and my cheek feels sore after I bite something.',
      'I wish I had something to help soothe the pain until I see the dentist.'
    ], items: ['medicine','firstaid']
  },
  {
    id: 'earache', img: '/assets/boyear.png', title: 'Earache',
    lines: [
      'Something inside my ear hurts and noises feel too loud sometimes.',
      'I feel a bit warm too — I wonder how hot I am.'
    ], items: ['medicine','thermometer']
  },
  {
    id: 'eye', img: '/assets/boyeye.png', title: 'Eye Infection',
    lines: [
      'My eyes are red and they sting when I blink.',
      'I shouldn\'t rub them but a clean cloth might help gently wipe them.'
    ], items: ['medicine','wetcloth','firstaid']
  },
  {
    id: 'vomiting', img: '/assets/boyvomit.png', title: 'Vomiting',
    lines: [
      'My tummy feels upset and I keep throwing up.',
      'I feel weak and keep reaching for something to wipe my mouth.'
    ], items: ['medicine','tissue']
  },
  {
    id: 'diarrhea', img: '/assets/boypotty.png', title: 'Diarrhea',
    lines: [
      'My tummy is cramping and I need to go to the toilet a lot.',
      'Sipping water helps but I also need something to make me feel steady.'
    ], items: ['medicine','toilet','wetcloth']
  },
  {
    id: 'skin', img: '/assets/boyskin.png', title: 'Skin Allergy',
    lines: [
      'My skin is itchy and there are red patches that make me want to scratch.',
      'Something cool and clean would help calm it down.'
    ], items: ['medicine','wetcloth','firstaid']
  },
  {
    id: 'stomach', img: '/assets/boystomach.png', title: 'Stomach Pain',
    lines: [
      'My tummy hurts.',
      'A warm drink sometimes helps me feel a bit better.'
    ], items: ['medicine','hotdrink']
  },
  {
    id: 'throat', img: '/assets/boythroat.png', title: 'Throat Pain',
    lines: [
      'My throat is sore and it hurts when I swallow food.',
      'Sipping something warm helps my throat feel less scratchy.'
    ], items: ['medicine','hotdrink']
  }
]

export default CONDITIONS
