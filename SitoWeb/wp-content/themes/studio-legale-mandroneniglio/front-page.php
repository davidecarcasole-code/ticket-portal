<?php get_header(); ?>

<main id="primary" class="site-main front-page">

    <section class="hero-section">
        <div class="hero-slider" id="hero-slider">
            <div class="hero-slide active" data-index="0">
                <div class="hero-bg" style="background: linear-gradient(135deg, rgba(27,27,47,0.92) 0%, rgba(42,42,74,0.85) 50%, rgba(27,27,47,0.95) 100%), url('<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/hero-law-1.svg') center/cover no-repeat;">
                    <div class="hero-particles"></div>
                </div>
                <div class="container">
                    <div class="hero-content">
                        <span class="hero-badge">Eccellenza legale dal 1985</span>
                        <h1 class="hero-title">Il tuo alleato legale di fiducia</h1>
                        <p class="hero-subtitle">Oltre 35 anni di esperienza al servizio dei nostri clienti. Competenza, dedizione e risultati concreti in ogni area del diritto.</p>
                        <div class="hero-actions">
                            <a href="<?php echo esc_url(home_url('/contatti')); ?>" class="btn btn-primary btn-lg"><i class="fas fa-calendar-check"></i> Richiedi una consulenza</a>
                            <a href="<?php echo esc_url(home_url('/lo-studio')); ?>" class="btn btn-outline btn-lg"><i class="fas fa-info-circle"></i> Scopri lo Studio</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-slide" data-index="1">
                <div class="hero-bg" style="background: linear-gradient(135deg, rgba(27,27,47,0.9) 0%, rgba(15,15,31,0.88) 50%, rgba(27,27,47,0.92) 100%), url('<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/hero-law-1.svg') center/cover no-repeat;">
                    <div class="hero-particles"></div>
                </div>
                <div class="container">
                    <div class="hero-content">
                        <span class="hero-badge">Professionisti al tuo servizio</span>
                        <h1 class="hero-title">Un team di esperti per ogni esigenza</h1>
                        <p class="hero-subtitle">Avvocati specializzati in diritto civile, penale, amministrativo, famiglia, lavoro e societario. Ogni caso è affidato al professionista più qualificato.</p>
                        <div class="hero-actions">
                            <a href="<?php echo esc_url(home_url('/lo-studio')); ?>" class="btn btn-primary btn-lg"><i class="fas fa-users"></i> Conosci il Team</a>
                            <a href="<?php echo esc_url(home_url('/contatti')); ?>" class="btn btn-outline btn-lg"><i class="fas fa-calendar-alt"></i> Prenota un incontro</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-slide" data-index="2">
                <div class="hero-bg" style="background: linear-gradient(135deg, rgba(27,27,47,0.93) 0%, rgba(42,42,74,0.8) 50%, rgba(27,27,47,0.9) 100%), url('<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/hero-law-1.svg') center/cover no-repeat;">
                    <div class="hero-particles"></div>
                </div>
                <div class="container">
                    <div class="hero-content">
                        <span class="hero-badge">Risultati concreti</span>
                        <h1 class="hero-title">Oltre 3.500 cause vinte</h1>
                        <p class="hero-subtitle">Un track record di successi che parla da solo. Ogni cliente è una storia di impegno, competenza e dedizione alla giustizia.</p>
                        <div class="hero-actions">
                            <a href="<?php echo esc_url(home_url('/servizi')); ?>" class="btn btn-primary btn-lg"><i class="fas fa-gavel"></i> I nostri servizi</a>
                            <a href="<?php echo esc_url(home_url('/forum')); ?>" class="btn btn-outline btn-lg"><i class="fas fa-comments"></i> Forum Legale</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-slide" data-index="3">
                <div class="hero-bg" style="background: linear-gradient(135deg, rgba(27,27,47,0.9) 0%, rgba(15,15,31,0.85) 50%, rgba(42,42,74,0.9) 100%), url('<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/hero-law-1.svg') center/cover no-repeat;">
                    <div class="hero-particles"></div>
                </div>
                <div class="container">
                    <div class="hero-content">
                        <span class="hero-badge">Diritto nell'era digitale</span>
                        <h1 class="hero-title">Consulenza legale moderna e accessibile</h1>
                        <p class="hero-subtitle">Un approccio innovativo che unisce la tradizione giuridica alla tecnologia. Assistenza online, piattaforma digitale e comunicazione trasparente.</p>
                        <div class="hero-actions">
                            <a href="<?php echo esc_url(home_url('/contatti')); ?>" class="btn btn-primary btn-lg"><i class="fas fa-video"></i> Consulenza Online</a>
                            <a href="<?php echo esc_url(slm_get_registration_url()); ?>" class="btn btn-outline btn-lg"><i class="fas fa-user-plus"></i> Area Riservata</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="hero-nav">
            <button class="hero-arrow hero-prev" aria-label="Precedente"><i class="fas fa-chevron-left"></i></button>
            <div class="hero-dots">
                <button class="hero-dot active" data-slide="0" aria-label="Slide 1"></button>
                <button class="hero-dot" data-slide="1" aria-label="Slide 2"></button>
                <button class="hero-dot" data-slide="2" aria-label="Slide 3"></button>
                <button class="hero-dot" data-slide="3" aria-label="Slide 4"></button>
            </div>
            <button class="hero-arrow hero-next" aria-label="Successivo"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="hero-progress"><div class="hero-progress-bar"></div></div>
    </section>

    <section class="trust-section">
        <div class="container">
            <div class="trust-bar">
                <div class="trust-item">
                    <span class="trust-number" data-target="1200">0</span>
                    <span class="trust-label">Clienti assistiti</span>
                </div>
                <div class="trust-item">
                    <span class="trust-number" data-target="3500">0</span>
                    <span class="trust-label">Cause vinte</span>
                </div>
                <div class="trust-item">
                    <span class="trust-number" data-target="38">0</span>
                    <span class="trust-label">Anni di esperienza</span>
                </div>
                <div class="trust-item">
                    <span class="trust-number" data-target="98">0</span>
                    <span class="trust-label-perc">%</span>
                    <span class="trust-label">Casi risolti con successo</span>
                </div>
            </div>
        </div>
    </section>

    <section class="areas-section">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-badge">Aree di competenza</span>
                <h2 class="section-title">I nostri settori di diritto</h2>
                <p class="section-desc">Offriamo consulenza e assistenza legale a 360 gradi, coprendo tutte le principali aree del diritto.</p>
            </div>
            <div class="areas-grid">
                <a href="<?php echo esc_url(home_url('/diritto-civile')); ?>" class="area-card fade-in">
                    <div class="area-icon"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="15" fill="rgba(197,165,90,0.1)"/><path d="M30 15L37 22H33V32H27V22H23L30 15Z" fill="#C5A55A"/><rect x="20" y="33" width="20" height="3" rx="1.5" fill="#C5A55A"/><rect x="22" y="38" width="16" height="3" rx="1.5" fill="#C5A55A"/><rect x="24" y="43" width="12" height="3" rx="1.5" fill="#C5A55A"/></svg></div>
                    <h3>Diritto Civile</h3>
                    <p>Contratti, responsabilità civile, risarcimento danni, proprietà e obbligazioni.</p>
                    <span class="area-link">Scopri di più <i class="fas fa-arrow-right"></i></span>
                </a>
                <a href="<?php echo esc_url(home_url('/diritto-penale')); ?>" class="area-card fade-in">
                    <div class="area-icon"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="15" fill="rgba(197,165,90,0.1)"/><path d="M42 20L40 18L38 20L36 18L34 20L30 16L34 12L36 14L38 12L40 14L42 12L46 16L42 20Z" fill="#C5A55A"/><circle cx="35" cy="30" r="7" fill="#C5A55A"/><path d="M25 38C25 35.5 27 33 30 33H40C43 33 45 35.5 45 38V42H25V38Z" fill="#C5A55A"/></svg></div>
                    <h3>Diritto Penale</h3>
                    <p>Difesa penale, diritto penale dell'economia, reati societari e tributari.</p>
                    <span class="area-link">Scopri di più <i class="fas fa-arrow-right"></i></span>
                </a>
                <a href="<?php echo esc_url(home_url('/diritto-amministrativo')); ?>" class="area-card fade-in">
                    <div class="area-icon"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="15" fill="rgba(197,165,90,0.1)"/><rect x="18" y="18" width="24" height="10" rx="2" fill="#C5A55A"/><rect x="20" y="32" width="20" height="3" rx="1.5" fill="#C5A55A"/><rect x="22" y="39" width="16" height="3" rx="1.5" fill="#C5A55A"/><circle cx="30" cy="23" r="3" fill="#1B1B2F"/></svg></div>
                    <h3>Diritto Amministrativo</h3>
                    <p>Ricorsi amministrativi, appalti pubblici, edilizia e urbanistica.</p>
                    <span class="area-link">Scopri di più <i class="fas fa-arrow-right"></i></span>
                </a>
                <a href="<?php echo esc_url(home_url('/diritto-di-famiglia')); ?>" class="area-card fade-in">
                    <div class="area-icon"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="15" fill="rgba(197,165,90,0.1)"/><circle cx="22" cy="22" r="5" fill="#C5A55A"/><circle cx="38" cy="22" r="5" fill="#C5A55A"/><circle cx="30" cy="30" r="4" fill="#C5A55A"/><path d="M22 40C22 35.5 24 33 30 33C36 33 38 35.5 38 40V42H22V40Z" fill="#C5A55A"/></svg></div>
                    <h3>Diritto di Famiglia</h3>
                    <p>Separazioni, divorzi, affidamento minori, adozioni e successioni.</p>
                    <span class="area-link">Scopri di più <i class="fas fa-arrow-right"></i></span>
                </a>
                <a href="<?php echo esc_url(home_url('/diritto-del-lavoro')); ?>" class="area-card fade-in">
                    <div class="area-icon"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="15" fill="rgba(197,165,90,0.1)"/><rect x="20" y="24" width="20" height="12" rx="2" fill="#C5A55A"/><rect x="17" y="30" width="26" height="14" rx="2" fill="#C5A55A"/><path d="M27 24V22C27 20.5 28 19 30 19C32 19 33 20.5 33 22V24" stroke="#1B1B2F" stroke-width="2" stroke-linecap="round"/></svg></div>
                    <h3>Diritto del Lavoro</h3>
                    <p>Rapporti di lavoro, licenziamenti, infortuni e previdenza sociale.</p>
                    <span class="area-link">Scopri di più <i class="fas fa-arrow-right"></i></span>
                </a>
                <a href="<?php echo esc_url(home_url('/diritto-societario')); ?>" class="area-card fade-in">
                    <div class="area-icon"><svg width="60" height="60" viewBox="0 0 60 60" fill="none"><rect width="60" height="60" rx="15" fill="rgba(197,165,90,0.1)"/><rect x="16" y="22" width="12" height="18" rx="2" fill="#C5A55A"/><rect x="32" y="16" width="12" height="24" rx="2" fill="#C5A55A"/><rect x="24" y="34" width="12" height="6" rx="1" fill="#C5A55A"/></svg></div>
                    <h3>Diritto Societario</h3>
                    <p>Costituzione società, fusioni, acquisizioni, contratti commerciali.</p>
                    <span class="area-link">Scopri di più <i class="fas fa-arrow-right"></i></span>
                </a>
            </div>
        </div>
    </section>

    <section class="about-section parallax-section">
        <div class="parallax-bg" style="background: linear-gradient(135deg, rgba(27,27,47,0.03) 0%, rgba(197,165,90,0.05) 100%);"></div>
        <div class="container">
            <div class="about-grid">
                <div class="about-content fade-in">
                    <span class="section-badge">Chi siamo</span>
                    <h2>Oltre 35 anni al servizio della giustizia</h2>
                    <p>Lo Studio Legale Mandroneniglio nasce a Roma nel 1985 dalla visione del fondatore, l'Avv. Marco Mandroneniglio. Da oltre tre decenni offriamo assistenza legale di alto profilo, combinando competenza tecnica, esperienza maturata sul campo e un approccio umano e personalizzato.</p>
                    <p>Il nostro team è composto da avvocati specializzati in diverse aree del diritto, affiancati da praticanti e collaboratori che condividono la stessa passione per la giustizia e l'impegno verso il cliente.</p>
                    <div class="about-features">
                        <div class="feature"><i class="fas fa-check-circle"></i><span>Team multidisciplinare</span></div>
                        <div class="feature"><i class="fas fa-check-circle"></i><span>Assistenza personalizzata</span></div>
                        <div class="feature"><i class="fas fa-check-circle"></i><span>Trasparenza dei costi</span></div>
                        <div class="feature"><i class="fas fa-check-circle"></i><span>Aggiornamento costante</span></div>
                    </div>
                    <a href="<?php echo esc_url(home_url('/lo-studio')); ?>" class="btn btn-primary">Conosci il nostro team <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="about-image fade-in">
                    <img src="<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/about-studio.svg" alt="Studio Legale Mandroneniglio">
                    <div class="about-experience-badge">
                        <span class="years">38+</span>
                        <span class="text">Anni di esperienza</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="features-section">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-badge">Perché sceglierci</span>
                <h2 class="section-title">Il nostro valore aggiunto</h2>
            </div>
            <div class="features-grid">
                <div class="feature-card fade-in">
                    <div class="feature-card-icon"><i class="fas fa-gavel"></i></div>
                    <h3>Competenza</h3>
                    <p>Specialisti in molteplici rami del diritto con aggiornamento professionale continuo.</p>
                </div>
                <div class="feature-card fade-in">
                    <div class="feature-card-icon"><i class="fas fa-handshake"></i></div>
                    <h3>Affidabilità</h3>
                    <p>Oltre 3500 cause gestite con successo. La nostra reputazione ci precede.</p>
                </div>
                <div class="feature-card fade-in">
                    <div class="feature-card-icon"><i class="fas fa-users"></i></div>
                    <h3>Team dedicato</h3>
                    <p>Ogni cliente ha un referente diretto che segue il caso dall'inizio alla fine.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="testimonials-section">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-badge" style="background:rgba(197,165,90,0.15);">Testimonianze</span>
                <h2 class="section-title">Cosa dicono i nostri clienti</h2>
            </div>
            <div class="testimonials-carousel" id="testimonials-carousel">
                <div class="testimonials-track">
                    <div class="testimonial-card">
                        <div class="testimonial-stars">★★★★★</div>
                        <p class="testimonial-text">"Ho affidato allo Studio Mandroneniglio una complessa causa civile. Professionalità, competenza e grande umanità. Risultato eccellente."</p>
                        <div class="testimonial-author">
                            <img src="<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/testimonial-1.svg" alt="Mario Rossi">
                            <div><strong>Mario R.</strong><span>Diritto Civile</span></div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-stars">★★★★★</div>
                        <p class="testimonial-text">"L'Avv. Mandroneniglio mi ha seguita in una delicata causa di separazione. Sensibilità e competenza fuori dal comune. Consigliatissima."</p>
                        <div class="testimonial-author">
                            <img src="<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/testimonial-2.svg" alt="Maria Bianchi">
                            <div><strong>Laura F.</strong><span>Diritto di Famiglia</span></div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-stars">★★★★★</div>
                        <p class="testimonial-text">"Eccellente studio legale. Preparazione e tempestività nella gestione delle pratiche amministrative. Li raccomando senza riserve."</p>
                        <div class="testimonial-author">
                            <img src="<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/testimonial-3.svg" alt="Giuseppe Verdi">
                            <div><strong>Giuseppe V.</strong><span>Diritto Amministrativo</span></div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-stars">★★★★★</div>
                        <p class="testimonial-text">"Professionalità senza pari. Mi hanno assistito in una causa societaria complessa con risultati che superano ogni aspettativa."</p>
                        <div class="testimonial-author">
                            <img src="<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/testimonial-1.svg" alt="Andrea C.">
                            <div><strong>Andrea C.</strong><span>Diritto Societario</span></div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-stars">★★★★★</div>
                        <p class="testimonial-text">"Competenza e umanità. L'Avv. Bianchi è stata incredibile nel seguire la mia pratica di licenziamento. Consiglio vivamente questo studio."</p>
                        <div class="testimonial-author">
                            <img src="<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/testimonial-2.svg" alt="Elena M.">
                            <div><strong>Elena M.</strong><span>Diritto del Lavoro</span></div>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-stars">★★★★★</div>
                        <p class="testimonial-text">"Veloci, precisi, trasparenti. Tutto ciò che si cerca in uno studio legale. Li ringrazierò sempre per come hanno gestito la mia pratica."</p>
                        <div class="testimonial-author">
                            <img src="<?php echo esc_url(SLM_THEME_URI); ?>/assets/images/testimonial-3.svg" alt="Roberto F.">
                            <div><strong>Roberto F.</strong><span>Diritto Penale</span></div>
                        </div>
                    </div>
                </div>
                <div class="testimonials-nav">
                    <button class="testimonial-arrow testimonial-prev" aria-label="Precedente"><i class="fas fa-chevron-left"></i></button>
                    <div class="testimonial-dots"></div>
                    <button class="testimonial-arrow testimonial-next" aria-label="Successivo"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
    </section>

    <section class="forum-preview-section">
        <div class="container">
            <div class="section-header fade-in">
                <span class="section-badge">Community</span>
                <h2 class="section-title">Forum Legale</h2>
                <p class="section-desc">Uno spazio di confronto e informazione legale. Poni domande, condividi esperienze e ricevi risposte dai nostri esperti.</p>
            </div>
            <div class="forum-cta fade-in">
                <a href="<?php echo esc_url(home_url('/forum')); ?>" class="btn btn-primary btn-lg"><i class="fas fa-comments"></i> Visita il Forum</a>
                <?php if (!is_user_logged_in()) : ?>
                <a href="<?php echo esc_url(slm_get_registration_url()); ?>" class="btn btn-outline btn-lg"><i class="fas fa-user-plus"></i> Registrati per partecipare</a>
                <?php endif; ?>
            </div>
            <?php
            $recent_topics = slm_get_recent_forum_topics(3);
            if ($recent_topics) : ?>
            <div class="recent-topics fade-in">
                <h3>Discussioni recenti</h3>
                <div class="topics-list">
                    <?php foreach ($recent_topics as $topic) : ?>
                    <div class="topic-item">
                        <a href="<?php echo esc_url(get_permalink($topic->ID)); ?>">
                            <span class="topic-title"><?php echo esc_html($topic->post_title); ?></span>
                            <span class="topic-meta"><?php echo esc_html(slm_get_forum_topic_reply_count($topic->ID)); ?> repliche &middot; <?php echo esc_html(get_the_author_meta('display_name', $topic->post_author)); ?></span>
                        </a>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <section class="contact-cta-section">
        <div class="container">
            <div class="cta-box fade-in">
                <div class="cta-content">
                    <h2>Hai bisogno di assistenza legale?</h2>
                    <p>Contattaci per una prima valutazione gratuita del tuo caso. Rispondiamo in massimo 24 ore.</p>
                </div>
                <div class="cta-actions">
                    <a href="<?php echo esc_url(home_url('/contatti')); ?>" class="btn btn-primary btn-lg"><i class="fas fa-envelope"></i> Contattaci ora</a>
                    <a href="tel:+390612345678" class="btn btn-outline btn-lg"><i class="fas fa-phone"></i> +39 06 12345678</a>
                </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>
