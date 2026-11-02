// Reviews functionality

let reviewForm, reviewsList, ratingStars, reviewRatingInput, reviewNameInput, reviewAnonymousCheckbox, reviewTextArea, successModal, modalCloseBtn;
let selectedRating = 0;

function safeParseReviews() {
  try {
    const raw = localStorage.getItem('reviews');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Invalid reviews in localStorage, clearing.', err);
    localStorage.removeItem('reviews');
    return null;
  }
}

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  reviewForm = document.getElementById('reviewForm');
  reviewsList = document.getElementById('reviewsList');
  ratingStars = document.querySelectorAll('.star');
  reviewRatingInput = document.getElementById('reviewRating');
  reviewNameInput = document.getElementById('reviewName');
  reviewAnonymousCheckbox = document.getElementById('reviewAnonymous');
  reviewTextArea = document.getElementById('reviewText');
  successModal = document.getElementById('successModal');
  modalCloseBtn = document.getElementById('modalCloseBtn');
    // Close modal
  modalCloseBtn.addEventListener('click', () => {
    successModal.classList.remove('show');
  });

  // Close modal when clicking outside
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('show');
    }
  });

  // Load existing reviews
  loadReviews();

  // Guard: ensure elements exist before attaching listeners
  if (reviewNameInput) {
    // Restrict name input to letters only (live cleanup)
    reviewNameInput.addEventListener('input', (e) => {
      const value = e.target.value;
      const valid = value.replace(/[^A-Za-zА-Яа-яЁё\s\-]/g, '');
      if (value !== valid) e.target.value = valid;
    });
  }

  if (ratingStars && ratingStars.length) {
    ratingStars.forEach(star => {
      star.addEventListener('click', (e) => {
        e.preventDefault();
        selectedRating = parseInt(star.dataset.rating) || 0;
        if (reviewRatingInput) reviewRatingInput.value = selectedRating;
        updateStarDisplay();
      });

      star.addEventListener('mouseover', () => {
        const hoverRating = parseInt(star.dataset.rating) || 0;
        ratingStars.forEach(s => {
          if (parseInt(s.dataset.rating) <= hoverRating) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        });
      });
    });

    const ratingWrap = document.getElementById('ratingStars');
    if (ratingWrap) {
      ratingWrap.addEventListener('mouseout', () => updateStarDisplay());
    }
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (selectedRating === 0) {
        alert('Пожалуйста, выберите оценку');
        return;
      }

      const nameVal = reviewAnonymousCheckbox && reviewAnonymousCheckbox.checked ? 'Аноним' : (reviewNameInput ? reviewNameInput.value.trim() : '');
      if (!nameVal) {
        alert('Пожалуйста, введите имя или выберите анонимный отзыв');
        return;
      }

      const textVal = reviewTextArea ? reviewTextArea.value.trim() : '';

      const formData = {
        name: nameVal,
        rating: selectedRating,
        text: textVal,
        date: formatDate(new Date())
      };

      // Save to localStorage safely
      const existing = safeParseReviews() || getDefaultReviews();
      existing.unshift(formData);
      try {
        localStorage.setItem('reviews', JSON.stringify(existing));
      } catch (err) {
        console.error('Failed to save review', err);
      }

      // Reset form
      reviewForm.reset();
      selectedRating = 0;
      if (reviewRatingInput) reviewRatingInput.value = '';
      updateStarDisplay();

      // Show success modal
    showModal();

      

      // Reload reviews list
      setTimeout(loadReviews, 300);
    });
  }
});




function updateStarDisplay() {
  if (!ratingStars || !ratingStars.forEach) return;
  ratingStars.forEach(star => {
    const r = parseInt(star.dataset.rating) || 0;
    if (r <= selectedRating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

// Load and display reviews
function loadReviews() {
  const reviews = safeParseReviews() || getDefaultReviews();
  reviewsList.innerHTML = '';

  reviews.forEach(review => {
    const reviewCard = createReviewCard(review);
    reviewsList.appendChild(reviewCard);
  });
}

// Create review card element
function createReviewCard(review) {
  const card = document.createElement('div');
  card.className = 'review-card';

  const header = document.createElement('div');
  header.className = 'review-header';

  const name = document.createElement('div');
  name.className = 'review-name';
  name.textContent = review.name;

  const date = document.createElement('div');
  date.className = 'review-date';
  date.textContent = review.date;

  header.appendChild(name);
  header.appendChild(date);

  const rating = document.createElement('div');
  rating.className = 'review-rating';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'review-star';
    star.innerHTML = i <= review.rating 
      ? '★' 
      : '☆';
    star.style.color = i <= review.rating ? '#FFCC00' : '#3E3E3E';
    star.style.fontSize = '20px';
    rating.appendChild(star);
  }

  const text = document.createElement('p');
  text.className = 'review-text';
  text.textContent = review.text;

  card.appendChild(header);
  card.appendChild(rating);
  card.appendChild(text);

  return card;
}

// Format date as DD.MM.YY
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

// Show success modal
function showModal() {
  successModal.classList.add('show');
}

// Close modal
modalCloseBtn.addEventListener('click', () => {
  successModal.classList.remove('show');
});

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) {
    successModal.classList.remove('show');
  }
});

// Default reviews if none exist
function getDefaultReviews() {
  return [
    {
      name: 'Екатерина Лужецкая',
      date: '15.05.26',
      rating: 5,
      text: '«Артём ходит к Екатерине Морозовой уже полгода. Сын всегда ждёт тренировку с нетерпением! Тренер нашла подход даже к такому непоседе. Уроки проходят в игровой форме, ребёнок не просто учится играть, но и стал более дисциплинированным. Отдельное спасибо за терпение и доброту. Обязательно пойдём на следующий год!»'
    },
    {
      name: 'Дарья',
      date: '10.03.26',
      rating: 5,
      text: '«Долго выбирал школу, где можно заниматься в удобное время и не чувствовать себя неловко как новичок. В Ace Tennis идеально! Вечерние группы, внимательные тренеры, отличные корты. Отдельный плюс — можно прийти с другом в пару. Теннис стал моим главным хобби.»'
    },
    {
      name: 'Наталья',
      date: '01.03.26',
      rating: 5,
      text: '«София начала заниматься с нуля, боялась ракетки и стеснялась. Анна Серебрякова буквально за пару месяцев превратила её в уверенного игрока. Дочь участвовала в первых соревнованиях внутри школы — получила грамоту и море эмоций. Спасибо за веру в ребёнка!»'
    },
    {
      name: 'Софья',
      date: '12.02.26',
      rating: 5,
      text: '«Привела своих двойняшек к Юлии Кравцовой, и это любовь с первого занятия! Юлия занимается с малышами как волшебница — через мячики, обручи, игры. Дети бегут на корт с криками «скорее!». Ракетки, мячи — всё предоставили. Очень рада, что нашла такую школу.»'
    }
  ];
}
