const pages = document.querySelectorAll('.page');
const navButtons = document.querySelectorAll('.nav-btn');
const sideButtons = document.querySelectorAll('.side-btn');
const homeBanner = document.getElementById('homeBanner');
const profileCircle = document.getElementById('profileCircle');
const imagesGrid = document.getElementById('imagesGrid');
const videosGrid = document.getElementById('videosGrid');
const adminGallery = document.getElementById('adminGallery');
const termsModal = document.getElementById('termsModal');
const termsScroll = document.getElementById('termsScroll');
const termsActions = document.getElementById('termsActions');
const agreeBtn = document.getElementById('agreeBtn');
const adultBtn = document.getElementById('adultBtn');
const signupBtn = document.getElementById('signupBtn');
const signupPopup = document.getElementById('signupPopup');
const adminLock = document.getElementById('adminLock');
const adminCodeInput = document.getElementById('adminCode');
const adminSubmit = document.getElementById('adminSubmit');
const deleteConfirm = document.getElementById('deleteConfirm');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const fullscreenView = document.getElementById('fullscreenView');
const fullscreenContent = document.getElementById('fullscreenContent');
const collapseBtn = document.getElementById('collapseBtn');
const supportForm = document.getElementById('supportForm');
const supportName = document.getElementById('supportName');
const supportEmail = document.getElementById('supportEmail');
const supportDescription = document.getElementById('supportDescription');
const supportSubmit = document.getElementById('supportSubmit');
const wordCount = document.getElementById('wordCount');

const STORAGE_KEYS = {
  profile: 'sloanex_profile',
  banner: 'sloanex_banner',
  images: 'sloanex_images',
  videos: 'sloanex_videos',
};

const state = {
  adminUnlocked: sessionStorage.getItem('sloanex_admin') === 'true',
  deleteTarget: null,
};

const adminHash = '620ea9e1685335e43243b0e35a2e3fc1acaac2f2ed3c08356bae0a3b54e6ae10';

const getStoredArray = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};

const setStoredArray = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const setPage = (targetId) => {
  pages.forEach((page) => {
    page.classList.toggle('active', page.id === targetId);
  });
  if (targetId === 'exclusive') {
    resetButtons();
  }
  if (targetId === 'admin') {
    showAdminLock();
  }
};

const resetButtons = () => {
  document.querySelectorAll('button').forEach((btn) => btn.classList.remove('clicked'));
};

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.add('clicked');
    setPage(button.dataset.target);
  });
});

sideButtons.forEach((button) => {
  button.addEventListener('click', () => {
    button.classList.add('clicked');
    setPage(button.dataset.target);
  });
});

signupBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  signupPopup.classList.add('show');
});

signupPopup.addEventListener('click', () => {
  signupPopup.classList.remove('show');
});

document.addEventListener('click', (event) => {
  if (
    signupPopup.classList.contains('show') &&
    !signupPopup.contains(event.target) &&
    !event.target.closest('#signupBtn')
  ) {
    signupPopup.classList.remove('show');
  }
});

const updateHomeImages = () => {
  const profile = localStorage.getItem(STORAGE_KEYS.profile);
  const banner = localStorage.getItem(STORAGE_KEYS.banner);

  if (profile) {
    profileCircle.innerHTML = `<img src="${profile}" alt="Profile" />`;
  }
  if (banner) {
    homeBanner.innerHTML = `<img src="${banner}" alt="Banner" />`;
  }
};

const renderContent = () => {
  imagesGrid.innerHTML = '';
  videosGrid.innerHTML = '';
  adminGallery.innerHTML = '';

  const images = getStoredArray(STORAGE_KEYS.images);
  const videos = getStoredArray(STORAGE_KEYS.videos);

  images.forEach((src, index) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Image ${index + 1}`;
    img.addEventListener('click', () => openFullscreen('image', src));
    imagesGrid.appendChild(img);

    const adminCard = createAdminCard('image', src, index);
    adminGallery.appendChild(adminCard);
  });

  videos.forEach((src, index) => {
    const video = document.createElement('video');
    video.src = src;
    video.controls = false;
    video.addEventListener('click', () => openFullscreen('video', src));
    videosGrid.appendChild(video);

    const adminCard = createAdminCard('video', src, index);
    adminGallery.appendChild(adminCard);
  });
};

const createAdminCard = (type, src, index) => {
  const card = document.createElement('div');
  card.className = 'admin-card';
  const media = document.createElement(type === 'image' ? 'img' : 'video');
  media.src = src;
  media.controls = type === 'video';
  card.appendChild(media);

  if (type === 'video') {
    const playBtn = document.createElement('button');
    playBtn.className = 'primary-btn';
    playBtn.textContent = 'Play';
    playBtn.addEventListener('click', () => {
      playBtn.classList.add('clicked');
      media.play();
    });
    card.appendChild(playBtn);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'primary-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteBtn.classList.add('clicked');
    state.deleteTarget = { type, index };
    deleteConfirm.classList.add('show');
  });
  card.appendChild(deleteBtn);

  return card;
};

confirmYes.addEventListener('change', () => {
  if (!confirmYes.checked || !state.deleteTarget) return;
  const listKey = state.deleteTarget.type === 'image' ? STORAGE_KEYS.images : STORAGE_KEYS.videos;
  const items = getStoredArray(listKey);
  items.splice(state.deleteTarget.index, 1);
  setStoredArray(listKey, items);
  state.deleteTarget = null;
  deleteConfirm.classList.remove('show');
  confirmYes.checked = false;
  confirmNo.checked = false;
  renderContent();
});

confirmNo.addEventListener('change', () => {
  if (!confirmNo.checked) return;
  state.deleteTarget = null;
  deleteConfirm.classList.remove('show');
  confirmYes.checked = false;
  confirmNo.checked = false;
});

const openFullscreen = (type, src) => {
  fullscreenContent.innerHTML = '';
  const media = document.createElement(type === 'image' ? 'img' : 'video');
  media.src = src;
  if (type === 'video') {
    media.controls = true;
    media.autoplay = true;
  }
  fullscreenContent.appendChild(media);
  fullscreenView.classList.add('show');
};

collapseBtn.addEventListener('click', () => {
  collapseBtn.classList.add('clicked');
  fullscreenView.classList.remove('show');
});

fullscreenView.addEventListener('click', (event) => {
  if (event.target === fullscreenView) {
    fullscreenView.classList.remove('show');
  }
});

const showAdminLock = () => {
  if (state.adminUnlocked) {
    adminLock.classList.remove('show');
    return;
  }
  adminLock.classList.add('show');
};

const hashCode = async (value) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

adminSubmit.addEventListener('click', async () => {
  adminSubmit.classList.add('clicked');
  const value = adminCodeInput.value.trim();
  if (!value) return;
  const hashed = await hashCode(value);
  if (hashed === adminHash) {
    state.adminUnlocked = true;
    sessionStorage.setItem('sloanex_admin', 'true');
    adminLock.classList.remove('show');
    adminCodeInput.value = '';
  } else {
    adminCodeInput.value = '';
  }
});

const handleFileUpload = (box, files) => {
  const type = box.dataset.upload;
  const progress = box.querySelector('.progress');
  const progressBar = progress.querySelector('.progress-bar');
  const progressText = progress.querySelector('.progress-text');
  const progressTime = progress.querySelector('.progress-time');
  progress.classList.remove('complete');
  progressText.textContent = '0%';
  progressTime.textContent = '0s';
  progressBar.style.setProperty('--progress', '0%');

  let seconds = 0;
  const timer = setInterval(() => {
    seconds += 1;
    progressTime.textContent = `${seconds}s`;
  }, 1000);

  const fileArray = Array.from(files);
  let processed = 0;

  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.setProperty('--progress', `${percent}%`);
        progressText.textContent = `${percent}%`;
      }
    };
    reader.onload = () => {
      processed += 1;
      if (type === 'profile') {
        localStorage.setItem(STORAGE_KEYS.profile, reader.result);
      } else if (type === 'banner') {
        localStorage.setItem(STORAGE_KEYS.banner, reader.result);
      } else if (type === 'images') {
        const images = getStoredArray(STORAGE_KEYS.images);
        images.push(reader.result);
        setStoredArray(STORAGE_KEYS.images, images);
      } else if (type === 'videos') {
        const videos = getStoredArray(STORAGE_KEYS.videos);
        videos.push(reader.result);
        setStoredArray(STORAGE_KEYS.videos, videos);
      }

      if (processed === fileArray.length) {
        clearInterval(timer);
        progress.classList.add('complete');
        progressText.textContent = 'Complete';
        progressTime.textContent = `${seconds}s`;
        updateHomeImages();
        renderContent();
      }
    };
    reader.readAsDataURL(file);
  });
};

const setupUploadBoxes = () => {
  document.querySelectorAll('.upload-box').forEach((box) => {
    const input = box.querySelector('input');
    input.addEventListener('change', (event) => {
      if (!event.target.files.length) return;
      handleFileUpload(box, event.target.files);
      input.value = '';
    });
    box.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    box.addEventListener('drop', (event) => {
      event.preventDefault();
      if (!event.dataTransfer.files.length) return;
      handleFileUpload(box, event.dataTransfer.files);
    });
  });
};

const checkTermsScroll = () => {
  const isBottom = termsScroll.scrollTop + termsScroll.clientHeight >= termsScroll.scrollHeight - 5;
  if (isBottom) {
    termsActions.style.opacity = '1';
    termsActions.style.pointerEvents = 'auto';
  }
};

termsScroll.addEventListener('scroll', checkTermsScroll);

const updateTermsButtons = () => {
  if (agreeBtn.classList.contains('clicked') && adultBtn.classList.contains('clicked')) {
    termsModal.classList.remove('show');
  }
};

agreeBtn.addEventListener('click', () => {
  agreeBtn.classList.add('clicked');
  updateTermsButtons();
});

adultBtn.addEventListener('click', () => {
  adultBtn.classList.add('clicked');
  updateTermsButtons();
});

const updateSupportButtonState = () => {
  const hasValues = supportName.value && supportEmail.value && supportDescription.value;
  supportSubmit.disabled = !hasValues;
};

const limitWords = () => {
  const words = supportDescription.value.trim().split(/\s+/).filter(Boolean);
  if (words.length > 200) {
    supportDescription.value = words.slice(0, 200).join(' ');
  }
  wordCount.textContent = `${Math.min(words.length, 200)} / 200 words`;
};

supportName.addEventListener('input', updateSupportButtonState);
supportEmail.addEventListener('input', updateSupportButtonState);
supportDescription.addEventListener('input', () => {
  limitWords();
  updateSupportButtonState();
});

supportForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  supportSubmit.classList.add('clicked');
  const payload = {
    name: supportName.value,
    email: supportEmail.value,
    description: supportDescription.value,
  };

  await fetch('https://formsubmit.co/ajax/insanitybjones@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      _subject: 'Customer Support Request',
      name: payload.name,
      email: payload.email,
      message: payload.description,
    }),
  });

  supportForm.reset();
  wordCount.textContent = '0 / 200 words';
  supportSubmit.disabled = true;
  setPage('exclusive');
});

const initTermsModal = () => {
  termsModal.classList.add('show');
  termsActions.style.opacity = '0.4';
  termsActions.style.pointerEvents = 'none';
};

const init = () => {
  initTermsModal();
  updateHomeImages();
  renderContent();
  setupUploadBoxes();
};

init();
