// Script: navigation, TTS narration, captions, drag & drop (accessible)
document.addEventListener('DOMContentLoaded',()=>{
  const startBtn = document.getElementById('startBtn');
  const landing = document.getElementById('landing');
  const lesson1 = document.getElementById('lesson1');
  const avatarBtn = document.getElementById('avatarBtn');
  const speechBubble = document.getElementById('speechBubble');
  const playBtn = document.getElementById('playBtn');
  const captionBtn = document.getElementById('captionBtn');
  const videoCaption = document.getElementById('videoCaption');
  const lessonVideo = document.getElementById('lessonVideo');
  const draggables = Array.from(document.querySelectorAll('.draggable'));
  const dropZone = document.getElementById('dropZone');

  function showView(view){
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    view.classList.add('active');
    view.focus();
  }

  startBtn.addEventListener('click',()=>{
    showView(lesson1);
    speechBubble.textContent = 'This lesson shows the Common Cold. Drag helpful items to the box.';
  });

  avatarBtn.addEventListener('click',()=>{
    const text = speechBubble.textContent || 'Hello!';
    speak(text);
    speechBubble.classList.toggle('visible');
  });

  function speak(text){
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  playBtn.addEventListener('click',()=>{
    // if a real video is present, toggle playback; also speak narration
    const narration = 'Common cold: runny nose, sneezing, sore throat. Rest, fluids, tissues, and thermometer help.';
    speak(narration);
    if(lessonVideo){
      if(lessonVideo.paused){
        lessonVideo.play().catch(()=>{});
        playBtn.textContent = 'Pause';
      } else {
        lessonVideo.pause();
        playBtn.textContent = 'Play';
      }
    }
    // reveal simple caption
    videoCaption.hidden = false;
    captionBtn.setAttribute('aria-pressed','true');
  });

  captionBtn.addEventListener('click',()=>{
    const pressed = captionBtn.getAttribute('aria-pressed') === 'true';
    captionBtn.setAttribute('aria-pressed', String(!pressed));
    videoCaption.hidden = pressed;
  });

  // Drag & drop handlers
  draggables.forEach(img=>{
    img.addEventListener('dragstart',(e)=>{
      e.dataTransfer.setData('text/plain', img.getAttribute('src'));
      img.classList.add('dragging');
    });
    img.addEventListener('dragend',()=>img.classList.remove('dragging'));

    // keyboard accessibility: Enter picks up, Enter on drop drops
    img.addEventListener('keydown',(e)=>{
      if(e.key === 'Enter'){
        img.classList.toggle('picked');
        speechBubble.textContent = img.alt + ' selected. Now focus Drop zone and press Enter to drop.';
        speak(img.alt + ' selected');
      }
    });
  });

  dropZone.addEventListener('dragover',(e)=>{e.preventDefault();dropZone.classList.add('over')});
  dropZone.addEventListener('dragleave',()=>dropZone.classList.remove('over'));
  dropZone.addEventListener('drop',(e)=>{
    e.preventDefault();dropZone.classList.remove('over');
    const src = e.dataTransfer.getData('text/plain');
    if(src){
      const img = document.createElement('img');
      img.src = src; img.alt = 'dropped item'; img.style.width='72px'; img.style.margin='6px';
      dropZone.appendChild(img);
      speechBubble.textContent = 'Item placed.';
      speak('Item placed');
    }
  });

  // Keyboard drop
  dropZone.addEventListener('keydown',(e)=>{
    if(e.key === 'Enter'){
      const picked = document.querySelector('.picked');
      if(picked){
        const src = picked.getAttribute('src');
        const img = document.createElement('img');
        img.src = src; img.alt = 'dropped item'; img.style.width='72px'; img.style.margin='6px';
        dropZone.appendChild(img);
        picked.classList.remove('picked');
        speechBubble.textContent = 'Item placed.';
        speak('Item placed');
      } else {
        speechBubble.textContent = 'No item selected. Use Tab to focus an item and press Enter.';
        speak('No item selected');
      }
    }
  });

  // Small safeguards
  window.addEventListener('error',(e)=>{
    console.error('Error:',e.message);
    speechBubble.textContent = 'Something went wrong. Try again.';
  });
});
