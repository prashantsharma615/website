/**
 * ÉCLAT Skin Lab - Interactive Skin Type Analysis Engine
 * Features:
 * - 6-Step Multi-Questionnaire with validation & keyboard accessibility
 * - Transparent scoring system: Oily, Dry, Combination, Normal, & Mixed
 * - Decoupled Sensitivity Assessment (co-occurring characteristic)
 * - Routine generation (AM & PM), Ingredient Guidance, Print & WhatsApp sharing
 * - Privacy-preserving: zero external tracking, client-side only
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Questionnaire Data Structure
  const quizQuestions = [
    {
      id: 1,
      question: "How does your skin feel after washing your face?",
      options: [
        {
          text: "Tight or dry",
          scores: { dry: 2.5, oily: 0, combo: 0.5, normal: 0 },
          sensitivity: 0.5
        },
        {
          text: "Comfortable",
          scores: { dry: 0, oily: 0, combo: 0, normal: 2.5 },
          sensitivity: 0
        },
        {
          text: "Oily or greasy",
          scores: { dry: 0, oily: 2.5, combo: 0.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Oily in some areas and dry in others",
          scores: { dry: 0.5, oily: 0.5, combo: 2.5, normal: 0 },
          sensitivity: 0
        }
      ]
    },
    {
      id: 2,
      question: "How does your skin look after a few hours?",
      options: [
        {
          text: "Shiny all over",
          scores: { dry: 0, oily: 2.5, combo: 0.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Dry or flaky",
          scores: { dry: 2.5, oily: 0, combo: 0, normal: 0 },
          sensitivity: 0.5
        },
        {
          text: "Shiny on the forehead, nose, and chin",
          scores: { dry: 0, oily: 0.5, combo: 2.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Mostly balanced",
          scores: { dry: 0, oily: 0, combo: 0, normal: 2.5 },
          sensitivity: 0
        }
      ]
    },
    {
      id: 3,
      question: "How visible are your pores?",
      options: [
        {
          text: "Large and noticeable",
          scores: { dry: 0, oily: 2.5, combo: 0.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Small and barely visible",
          scores: { dry: 1.5, oily: 0, combo: 0, normal: 1.5 },
          sensitivity: 0
        },
        {
          text: "Noticeable mainly around my nose",
          scores: { dry: 0, oily: 0.5, combo: 2.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Vary depending on the area",
          scores: { dry: 0, oily: 0.5, combo: 2.5, normal: 0 },
          sensitivity: 0
        }
      ]
    },
    {
      id: 4,
      question: "How often does your skin feel irritated, itchy, or react to products?",
      options: [
        {
          text: "Frequently",
          scores: { dry: 0.5, oily: 0, combo: 0, normal: 0 },
          sensitivity: 3.5
        },
        {
          text: "Sometimes",
          scores: { dry: 0, oily: 0, combo: 0, normal: 0 },
          sensitivity: 2.0
        },
        {
          text: "Rarely",
          scores: { dry: 0, oily: 0, combo: 0, normal: 0.5 },
          sensitivity: 0.5
        },
        {
          text: "Almost never",
          scores: { dry: 0, oily: 0, combo: 0, normal: 1.0 },
          sensitivity: 0.0
        }
      ]
    },
    {
      id: 5,
      question: "How does your skin usually feel during the day?",
      options: [
        {
          text: "Greasy",
          scores: { dry: 0, oily: 2.5, combo: 0.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Tight or rough",
          scores: { dry: 2.5, oily: 0, combo: 0, normal: 0 },
          sensitivity: 0.5
        },
        {
          text: "Oily in the T-zone but dry elsewhere",
          scores: { dry: 0.5, oily: 0.5, combo: 2.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Comfortable and balanced",
          scores: { dry: 0, oily: 0, combo: 0, normal: 2.5 },
          sensitivity: 0
        }
      ]
    },
    {
      id: 6,
      question: "What is your biggest skin concern?",
      options: [
        {
          text: "Excess oil or clogged pores",
          scores: { dry: 0, oily: 2.0, combo: 0.5, normal: 0 },
          sensitivity: 0
        },
        {
          text: "Dryness or flaking",
          scores: { dry: 2.0, oily: 0, combo: 0, normal: 0 },
          sensitivity: 0.5
        },
        {
          text: "Redness or irritation",
          scores: { dry: 0.5, oily: 0, combo: 0, normal: 0 },
          sensitivity: 2.5
        },
        {
          text: "Uneven texture or occasional breakouts",
          scores: { dry: 0, oily: 0.5, combo: 1.5, normal: 0.5 },
          sensitivity: 0
        },
        {
          text: "No major concerns",
          scores: { dry: 0, oily: 0, combo: 0, normal: 2.0 },
          sensitivity: 0
        }
      ]
    }
  ];

  // Skin Profiles Knowledge Database
  const skinProfiles = {
    oily: {
      name: "Oily Skin",
      summary: "Your sebaceous glands produce an abundance of natural sebum throughout the day. This provides innate moisture retention and slower visible aging, but also creates persistent shine, enlarged pores, and a susceptibility to congestion and comedones.",
      characteristics: [
        "Visible, enlarged pores particularly across the forehead, nose, and cheeks",
        "Midday shine requiring oil-blotting papers or powder",
        "Thicker cutaneous texture with resilient moisture retention",
        "Tendency toward blackheads, whiteheads, or inflammatory blemishes",
        "Makeup tends to slide or separate after several hours"
      ],
      amRoutine: [
        { step: "Clarifying Gentle Cleanser", desc: "A sulfate-free foaming or gel cleanser to remove overnight sebum without stripping the stratum corneum." },
        { step: "Pore-Refining Niacinamide Serum", desc: "2% to 5% Niacinamide to normalize sebum production and tighten the appearance of pore walls." },
        { step: "Oil-Free Gel Moisturizer", desc: "A lightweight, water-based hydrator with hyaluronic acid and glycerin to hydrate without heavy lipids." },
        { step: "Mattifying Broad-Spectrum SPF 50", desc: "A fluid or mineral sunscreen with an invisible, non-comedogenic matte finish." }
      ],
      pmRoutine: [
        { step: "Double Cleanse", desc: "Start with a light cleansing oil or micellar water to dissolve sunscreen, followed by your water-based cleanser." },
        { step: "Gentle Chemical Exfoliant (2-3x weekly)", desc: "1% to 2% Salicylic Acid (BHA) to penetrate lipid-rich pores and dissolve trapped debris." },
        { step: "Balancing Barrier Emulsion", desc: "A light peptide or ceramide fluid to support barrier recovery without causing pore occlusion." }
      ],
      ingredientsLove: [
        { name: "Salicylic Acid (BHA)", note: "Lipid-soluble exfoliant that clears congested pore linings." },
        { name: "Niacinamide (Vitamin B3)", note: "Regulates sebum synthesis and calms redness." },
        { name: "Zinc PCA", note: "Purifies the skin and helps control excess microbial activity." },
        { name: "Hyaluronic Acid", note: "Supplies water hydration without contributing any oil." }
      ],
      ingredientsCaution: [
        { name: "Heavy Mineral Oils & Petrolatum", note: "Can form an impermeable seal that exacerbates clogged pores." },
        { name: "Coconut Oil & Cocoa Butter", note: "Highly comedogenic lipids likely to trigger breakouts." },
        { name: "Denatured Alcohol (in high doses)", note: "Strips surface oils, triggering rebound sebum hyper-production." }
      ]
    },

    dry: {
      name: "Dry Skin",
      summary: "Your skin produces insufficient natural sebum and intercellular lipids, compromising your barrier's ability to lock in moisture. As a result, you may experience tightness, flaking, rough surface texture, and increased vulnerability to external aggressors.",
      characteristics: [
        "Noticeable tightness, especially after facial cleansing or bathing",
        "Micro-flaking, rough patches, or lack of radiant bounce",
        "Nearly invisible, tight pores across the entire face",
        "Skin quickly absorbs lotions and creams but stays thirsty",
        "Fine lines become more prominent when dehydrated"
      ],
      amRoutine: [
        { step: "Cream or Milky Cleanser", desc: "A non-foaming, lipid-replenishing lotion cleanser, or simply a lukewarm water rinse." },
        { step: "Hydrating Essence / Milky Toner", desc: "Formulated with panthenol, glycerin, and beta-glucan to flood thirsty cells with moisture." },
        { step: "Replenishing Barrier Cream", desc: "A rich cream containing essential fatty acids, ceramides NP/AP/EOP, and squalane." },
        { step: "Nourishing Moisturizing SPF 50+", desc: "A dewy, hydrating sunscreen containing antioxidants and humectants." }
      ],
      pmRoutine: [
        { step: "Nourishing Cleansing Balm", desc: "Gently melts away the day's impurities without disturbing the delicate lipid barrier." },
        { step: "Restorative Peptide & Ceramide Serum", desc: "Reinforces cell cohesion and boosts structural hydration overnight." },
        { step: "Occlusive Night Balm or Facial Oil", desc: "Seal everything in with 2-3 drops of pure squalane, marula, or rosehip seed oil." }
      ],
      ingredientsLove: [
        { name: "Ceramides (NP, AP, EOP)", note: "Rebuilds the intercellular 'mortar' of your skin barrier." },
        { name: "Pure Plant Squalane", note: "Biocompatible lipid that softens dry texture without heaviness." },
        { name: "Glycerin & Panthenol (Pro-Vitamin B5)", note: "Deeply binds water to the stratum corneum and soothes tightness." },
        { name: "Colloidal Oatmeal", note: "Protects against dry itchiness and micro-fissures." }
      ],
      ingredientsCaution: [
        { name: "Sulfates (SLS / SLES)", note: "Harsh surfactants that strip already scarce protective lipids." },
        { name: "High-Strength AHAs / Glycolic Acid", note: "Can cause severe stinging and peeling on compromised barriers." },
        { name: "Strong Synthetic Fragrances", note: "Can penetrate dry, cracked skin and spark contact dermatitis." }
      ]
    },

    combo: {
      name: "Combination Skin",
      summary: "Your complexion exhibits dual characteristics: an overactive T-zone (forehead, nose, and chin) with heightened oil production and larger pores, contrasted with normal to dry cheeks and temples. Your goal is targeted zoning and equilibrium.",
      characteristics: [
        "Shine develops across the forehead and nose by midday",
        "Cheeks remain comfortable, tight, or slightly dry",
        "Pores are noticeably more visible around the nasal bridge and center brow",
        "Prone to occasional breakouts on the T-zone while cheeks rarely break out",
        "Needs different product textures for different parts of the face"
      ],
      amRoutine: [
        { step: "Gentle Balancing Gel Cleanser", desc: "Cleanses excess T-zone oil without parching the drier outer perimeter of your face." },
        { step: "Dual-Action Hydrating Serum", desc: "A light hyaluronic acid and niacinamide formula that addresses both shine and dehydration." },
        { step: "Lightweight Lotion (Zoned Application)", desc: "Apply a light veil over the T-zone and a richer second layer over dry cheek zones." },
        { step: "Weightless Fluid Sunscreen SPF 50", desc: "A non-greasy, satin-finish SPF that won't clog your nose or dry your cheeks." }
      ],
      pmRoutine: [
        { step: "Micellar Water & Gentle Cleanse", desc: "Thoroughly lifts sunscreen and urban pollution while maintaining physiological pH." },
        { step: "Targeted T-Zone Treatment (2-3x weekly)", desc: "Apply gentle BHA or azelaic acid specifically to the nose and chin areas." },
        { step: "Barrier Recovery Night Cream", desc: "Nourishes the cheeks while maintaining a balanced sebum flow through the night." }
      ],
      ingredientsLove: [
        { name: "Niacinamide", note: "Balances sebum output in the T-zone while boosting ceramide synthesis in dry zones." },
        { name: "Hyaluronic Acid Multi-Weights", note: "Deeply hydrates the entire face without adding oil or congestion." },
        { name: "Green Tea Extract", note: "Provides antioxidant protection and calms sebaceous activity." },
        { name: "Allantoin", note: "Soothes dry patches while smoothing texture." }
      ],
      ingredientsCaution: [
        { name: "Heavy Single-Texture Heavy Creams", note: "May satisfy cheeks but trigger blackheads across the nose." },
        { name: "Astringent Alcohol Toners", note: "Dries out cheeks severely in an attempt to degrease the forehead." },
        { name: "Over-Exfoliating Scrubs", note: "Aggravates the boundary between dry and oily zones." }
      ]
    },

    normal: {
      name: "Normal / Balanced Skin",
      summary: "Your skin maintains an ideal physiological balance between lipid (oil) and aqueous (water) levels. Your stratum corneum is robust, your pore structure is refined, and you rarely experience persistent reactivity, tightness, or excessive shine.",
      characteristics: [
        "Even, soft cutaneous texture with a healthy natural radiance",
        "Pores are fine, small, and rarely congested",
        "Minimal sensitivity to environmental shifts or new formulations",
        "Balanced oil production that does not feel greasy or tight by evening",
        "Skin recovers quickly from temporary stress or dehydration"
      ],
      amRoutine: [
        { step: "Gentle Hydrating Cleanser", desc: "Maintains optimal barrier pH (5.5) and removes natural overnight metabolic waste." },
        { step: "Antioxidant Vitamin C Serum", desc: "Protects collagen reserves and shields against daytime environmental free-radical damage." },
        { step: "Lightweight Barrier Emulsion", desc: "Maintains your natural hydration and smooths skin elasticity." },
        { step: "Broad-Spectrum SPF 30 to 50", desc: "The ultimate preventative step to preserve healthy dermal longevity." }
      ],
      pmRoutine: [
        { step: "Silky Gentle Cleanser", desc: "Removes sunscreen, micro-dust, and cosmetics while respecting natural lipids." },
        { step: "Cell-Renewing Retinoid or Peptide Serum", desc: "Promotes cellular turnover, smooth tone, and nighttime regeneration." },
        { step: "Nourishing Night Moisturizer", desc: "Locks in vital moisture and supports cell repair as you sleep." }
      ],
      ingredientsLove: [
        { name: "Vitamin C (L-Ascorbic Acid / Derivatives)", note: "Brightens, evens tone, and fights photo-aging." },
        { name: "Peptides & Amino Acids", note: "Maintains dermal firmness and structural suppleness." },
        { name: "Centella Asiatica (Cica)", note: "Keeps the skin calm, balanced, and resilient." },
        { name: "Ceramides & Lipids", note: "Maintains the naturally intact moisture barrier." }
      ],
      ingredientsCaution: [
        { name: "Over-Complicated 10+ Step Routines", note: "Can disrupt a naturally healthy, harmonious barrier." },
        { name: "Aggressive Physical Scrubs", note: "Unnecessary mechanical friction that causes micro-tears." },
        { name: "Harsh Drying Alcohols", note: "Can artificially induce dehydration in an otherwise balanced barrier." }
      ]
    },

    mixed: {
      name: "Mixed / Complex Skin Profile",
      summary: "Your quiz answers show an intricate combination of conflicting characteristics—such as significant oiliness in certain areas coupled with acute dry flaking or rapid sensitivity. Because these signals overlap, a single static label may oversimplify your skin's true needs. We recommend focusing on gentle barrier restoration and consulting a licensed dermatologist for comprehensive skin mapping.",
      characteristics: [
        "Fluctuates significantly depending on climate, heating, or seasonal shifts",
        "Experiencing both localized flaking and localized breakout zones simultaneously",
        "Skin feels tight yet looks shiny in bright lighting (a hallmark of dehydrated barrier)",
        "Varied pore sizes that behave differently week-to-week",
        "Products that worked last month may suddenly feel uncomfortable"
      ],
      amRoutine: [
        { step: "Ultra-Gentle Non-Stripping Cleanser", desc: "Use a pH-neutral milky gel to cleanse without provoking either oil rebound or dryness." },
        { step: "Centella & Panthenol Barrier Essence", desc: "Calms conflicting cutaneous signals and restores micro-hydration." },
        { step: "Bi-Phasic Barrier Cream", desc: "A soothing, fragrance-free formula rich in ceramides and light squalane." },
        { step: "Mineral Zinc Oxide Sunscreen SPF 50", desc: "Naturally soothing, non-comedogenic physical filter ideal for unpredictable skin." }
      ],
      pmRoutine: [
        { step: "Fragrance-Free Micellar or Balm Cleanser", desc: "Gently dissolves sunscreen and grime without physical tugging." },
        { step: "Calming Barrier Serum", desc: "Prioritize barrier-repairing peptides and beta-glucan rather than aggressive exfoliants." },
        { step: "Minimalist Soothing Night Cream", desc: "Restores nocturnal lipid balance without clogging sensitive pores." }
      ],
      ingredientsLove: [
        { name: "Centella Asiatica (Madecassoside)", note: "Supreme botanical soother for irritated, mixed skin." },
        { name: "Panthenol (Vitamin B5)", note: "Promotes deep hydration and epidermal wound healing." },
        { name: "Ectoin & Beta-Glucan", note: "Guards against environmental and temperature micro-stressors." },
        { name: "Zinc Oxide", note: "Provides physical UV defense while actively calming cutaneous flare-ups." }
      ],
      ingredientsCaution: [
        { name: "Multi-Acid Cocktails", note: "Combining multiple AHAs, BHAs, and Retinoids can shock inconsistent skin." },
        { name: "Synthetic Essential Oils & Perfumes", note: "Common instigators of localized inflammation." },
        { name: "Extreme Water Temperatures", note: "Hot showers disrupt lipid balance; always use lukewarm water." }
      ]
    }
  };

  // State Management
  let currentQuestionIndex = 0;
  const userAnswers = {}; // stores questionId -> selectedOptionIndex

  // DOM Elements
  const questionContainer = document.getElementById('question-container');
  const stepCounter = document.getElementById('quiz-step-counter');
  const progressFill = document.getElementById('quiz-progress-fill');
  const progressBar = document.getElementById('quiz-progress-bar');
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');
  const validationAlert = document.getElementById('quiz-validation-alert');
  const startQuizBtn = document.getElementById('start-quiz-btn');
  const navCtaBtn = document.getElementById('nav-cta-btn');
  const quizCard = document.getElementById('quiz-card');
  const resultsCard = document.getElementById('results-card');
  const retakeQuizBtn = document.getElementById('retake-quiz-btn');
  const printResultsBtn = document.getElementById('print-results-btn');
  const whatsappBtn = document.getElementById('whatsapp-contact-btn');

  // Smooth scroll helper
  function scrollToQuiz() {
    const quizSection = document.getElementById('quiz-container');
    if (quizSection) {
      quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (startQuizBtn) {
    startQuizBtn.addEventListener('click', () => {
      scrollToQuiz();
    });
  }

  if (navCtaBtn) {
    navCtaBtn.addEventListener('click', () => {
      scrollToQuiz();
    });
  }

  // Render Current Question
  function renderQuestion(index) {
    const qData = quizQuestions[index];
    if (!qData) return;

    // Update Counter & Progress Bar
    const totalQuestions = quizQuestions.length;
    const progressPercent = Math.round(((index + 1) / totalQuestions) * 100);
    
    stepCounter.textContent = `Question ${index + 1} of ${totalQuestions}`;
    progressFill.style.width = `${progressPercent}%`;
    progressBar.setAttribute('aria-valuenow', progressPercent);

    // Update Buttons State
    prevBtn.disabled = index === 0;
    if (index === totalQuestions - 1) {
      nextBtn.innerHTML = `<span>View My Results</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    } else {
      nextBtn.innerHTML = `<span>Next Question</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
    }

    // Hide validation alert if any
    validationAlert.style.display = 'none';

    // Build Question HTML
    const selectedOptionIdx = userAnswers[qData.id];

    let optionsHtml = '';
    qData.options.forEach((opt, optIdx) => {
      const isChecked = selectedOptionIdx === optIdx;
      const selectedClass = isChecked ? 'selected' : '';
      optionsHtml += `
        <label class="option-item ${selectedClass}" for="opt-${qData.id}-${optIdx}">
          <input 
            type="radio" 
            name="quiz-q-${qData.id}" 
            id="opt-${qData.id}-${optIdx}" 
            value="${optIdx}" 
            class="option-radio"
            ${isChecked ? 'checked' : ''}
          >
          <span class="option-text">${opt.text}</span>
        </label>
      `;
    });

    questionContainer.innerHTML = `
      <div class="quiz-question-number">Step ${index + 1} of ${totalQuestions}</div>
      <h3 class="quiz-question-text">${qData.question}</h3>
      <div class="options-group" role="radiogroup" aria-labelledby="q-title-${qData.id}">
        ${optionsHtml}
      </div>
    `;

    // Attach click listeners to option labels & radio inputs
    const optionLabels = questionContainer.querySelectorAll('.option-item');
    optionLabels.forEach((label) => {
      label.addEventListener('click', (e) => {
        const radio = label.querySelector('input[type="radio"]');
        if (radio) {
          const optValue = parseInt(radio.value, 10);
          userAnswers[qData.id] = optValue;

          // Update active style classes
          optionLabels.forEach(l => l.classList.remove('selected'));
          label.classList.add('selected');
          radio.checked = true;

          // Clear validation message
          validationAlert.style.display = 'none';
        }
      });
    });
  }

  // Next Button Click Handler
  nextBtn.addEventListener('click', () => {
    const currentQ = quizQuestions[currentQuestionIndex];
    if (userAnswers[currentQ.id] === undefined) {
      validationAlert.style.display = 'flex';
      return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    } else {
      // Calculate and display results
      calculateAndShowResults();
    }
  });

  // Previous Button Click Handler
  prevBtn.addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex);
    }
  });

  // Keyboard navigation for accessibility
  document.addEventListener('keydown', (e) => {
    // Only handle if quiz is visible and user is not in a modal or input
    if (resultsCard.style.display !== 'none') return;
    if (e.target.tagName === 'INPUT' && e.target.type !== 'radio') return;

    if (e.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.classList.contains('option-item')) {
        activeElement.click();
      }
    }
  });

  // Skin Type Calculation Engine
  function calculateAndShowResults() {
    const scores = {
      oily: 0,
      dry: 0,
      combo: 0,
      normal: 0
    };
    let sensitivityScore = 0;

    // Aggregate scores from answered questions
    quizQuestions.forEach(q => {
      const chosenIdx = userAnswers[q.id];
      if (chosenIdx !== undefined) {
        const option = q.options[chosenIdx];
        if (option.scores) {
          scores.oily += option.scores.oily || 0;
          scores.dry += option.scores.dry || 0;
          scores.combo += option.scores.combo || 0;
          scores.normal += option.scores.normal || 0;
        }
        if (option.sensitivity) {
          sensitivityScore += option.sensitivity;
        }
      }
    });

    // Determine primary skin type
    const scoreEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topType = scoreEntries[0][0];
    const topScore = scoreEntries[0][1];
    const secondType = scoreEntries[1][0];
    const secondScore = scoreEntries[1][1];

    let estimatedSkinType = 'mixed';

    // Conflict detection: If top two scores are in sharp contradiction (e.g. oily vs dry)
    // or if the scores are tied closely with low confidence
    const scoreDiff = topScore - secondScore;
    const isConflict = (topType === 'oily' && secondType === 'dry' && scoreDiff < 2.0) ||
                       (topType === 'dry' && secondType === 'oily' && scoreDiff < 2.0);

    if (isConflict || topScore < 4.0 || (scoreDiff === 0 && topType !== secondType)) {
      estimatedSkinType = 'mixed';
    } else {
      estimatedSkinType = topType;
    }

    // Determine Sensitivity Level
    let sensitivityLevel = "Low Sensitivity (Resilient)";
    let sensitivityDesc = "Your skin demonstrates high tolerance to topical actives, weather changes, and standard cosmetic formulations without frequent reactivity.";
    let sensitivityTagClass = "";

    if (sensitivityScore >= 4.5) {
      sensitivityLevel = "High Sensitivity (Reactive Complexion)";
      sensitivityDesc = "Your skin displays an easily provoked barrier. Redness, stinging, itching, or product intolerance occur frequently. Always prioritize fragrance-free, hypoallergenic formulations and conduct 24-hour patch testing before trying new actives.";
      sensitivityTagClass = "badge-sensitive";
    } else if (sensitivityScore >= 2.0) {
      sensitivityLevel = "Moderate Sensitivity";
      sensitivityDesc = "Your skin occasionally reacts to fragrance, harsh weather, or concentrated acids. Maintain gentle baseline products and introduce active treatments gradually.";
    }

    // Populate Results DOM
    displayResultsCard(estimatedSkinType, scores, sensitivityLevel, sensitivityDesc, sensitivityTagClass);
  }

  function displayResultsCard(typeKey, scores, sensitivityLevel, sensitivityDesc, sensitivityTagClass) {
    const profile = skinProfiles[typeKey] || skinProfiles.combo;

    // Header & Summary
    document.getElementById('result-skin-type-name').textContent = profile.name;
    document.getElementById('result-skin-type-summary').textContent = profile.summary;

    // Sensitivity Tag & Guidance
    const sensitivityTag = document.getElementById('result-sensitivity-tag');
    const sensitivityLabel = document.getElementById('result-sensitivity-label');
    sensitivityLabel.textContent = `Cutaneous Characteristic: ${sensitivityLevel}`;
    if (sensitivityTagClass) {
      sensitivityTag.classList.add(sensitivityTagClass);
    } else {
      sensitivityTag.classList.remove('badge-sensitive');
    }

    const sensitivityGuidanceBox = document.getElementById('result-sensitivity-guidance');
    sensitivityGuidanceBox.innerHTML = `
      <h4>Sensitivity Profile: ${sensitivityLevel}</h4>
      <p>${sensitivityDesc}</p>
    `;

    // Transparent Diagnostic Scoring Bars
    const totalPoints = Math.max(1, scores.oily + scores.dry + scores.combo + scores.normal);
    const barsContainer = document.getElementById('scoring-bars-container');
    barsContainer.innerHTML = `
      <div class="score-bar-item">
        <div class="score-bar-header">
          <span>Oily Tendency</span>
          <span>${Math.round((scores.oily / totalPoints) * 100)}%</span>
        </div>
        <div class="score-meter-track">
          <div class="score-meter-fill" style="width: ${Math.round((scores.oily / totalPoints) * 100)}%;"></div>
        </div>
      </div>

      <div class="score-bar-item">
        <div class="score-bar-header">
          <span>Dry / Lipid Deficit</span>
          <span>${Math.round((scores.dry / totalPoints) * 100)}%</span>
        </div>
        <div class="score-meter-track">
          <div class="score-meter-fill" style="width: ${Math.round((scores.dry / totalPoints) * 100)}%;"></div>
        </div>
      </div>

      <div class="score-bar-item">
        <div class="score-bar-header">
          <span>Combination Zoned Tendency</span>
          <span>${Math.round((scores.combo / totalPoints) * 100)}%</span>
        </div>
        <div class="score-meter-track">
          <div class="score-meter-fill" style="width: ${Math.round((scores.combo / totalPoints) * 100)}%;"></div>
        </div>
      </div>

      <div class="score-bar-item">
        <div class="score-bar-header">
          <span>Normal / Balanced State</span>
          <span>${Math.round((scores.normal / totalPoints) * 100)}%</span>
        </div>
        <div class="score-meter-track">
          <div class="score-meter-fill" style="width: ${Math.round((scores.normal / totalPoints) * 100)}%;"></div>
        </div>
      </div>
    `;

    // Characteristics List
    const charList = document.getElementById('result-characteristics-list');
    charList.innerHTML = profile.characteristics.map(item => `<li>${item}</li>`).join('');

    // AM Routine
    const amList = document.getElementById('result-am-routine');
    amList.innerHTML = profile.amRoutine.map(step => `
      <li>
        <strong>${step.step}</strong>
        <span>${step.desc}</span>
      </li>
    `).join('');

    // PM Routine
    const pmList = document.getElementById('result-pm-routine');
    pmList.innerHTML = profile.pmRoutine.map(step => `
      <li>
        <strong>${step.step}</strong>
        <span>${step.desc}</span>
      </li>
    `).join('');

    // Ingredients to Love
    const loveList = document.getElementById('result-ingredients-love');
    loveList.innerHTML = profile.ingredientsLove.map(ing => `
      <li>
        <strong>${ing.name}</strong>
        <span>${ing.note}</span>
      </li>
    `).join('');

    // Ingredients Caution
    const cautionList = document.getElementById('result-ingredients-caution');
    cautionList.innerHTML = profile.ingredientsCaution.map(ing => `
      <li>
        <strong>${ing.name}</strong>
        <span>${ing.note}</span>
      </li>
    `).join('');

    // WhatsApp Direct Consult Link
    if (whatsappBtn) {
      const msg = encodeURIComponent(`Hello ÉCLAT Skin Lab! I just finished my skin analysis quiz and my estimated skin type is ${profile.name} (${sensitivityLevel}). Could you help recommend suitable formulations for my daily routine?`);
      whatsappBtn.href = `https://wa.me/?text=${msg}`;
    }

    // Toggle View from Quiz to Results
    quizCard.style.display = 'none';
    resultsCard.style.display = 'block';

    // Smooth scroll to top of results card
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Retake Quiz Handler
  if (retakeQuizBtn) {
    retakeQuizBtn.addEventListener('click', () => {
      // Clear all state
      currentQuestionIndex = 0;
      Object.keys(userAnswers).forEach(key => delete userAnswers[key]);

      // Hide results, show quiz card
      resultsCard.style.display = 'none';
      quizCard.style.display = 'block';

      // Re-render from question 1
      renderQuestion(0);

      // Scroll to quiz
      quizCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Print Results Handler
  if (printResultsBtn) {
    printResultsBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================
  // MODALS MANAGEMENT (About, Contact, Privacy, Disclaimer)
  // ==========================================
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      // Set focus inside modal
      const closeBtn = targetModal.querySelector('.modal-close-btn');
      if (closeBtn) closeBtn.focus();
    }
  }

  function closeModal(modal) {
    modal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal') || trigger.getAttribute('href').replace('#', '');
      openModal(modalId);
    });
  });

  modalBackdrops.forEach(modal => {
    // Close button click
    const closeBtns = modal.querySelectorAll('.modal-close-btn');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        closeModal(modal);
      });
    });

    // Click outside backdrop to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(modal => {
        if (!modal.hasAttribute('hidden')) {
          closeModal(modal);
        }
      });
    }
  });

  // Initial Quiz Render
  renderQuestion(0);
});
