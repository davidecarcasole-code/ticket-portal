<?php
/**
 * Template Name: Contatti
 */
get_header(); ?>

<main id="primary" class="site-main contact-page">
    <div class="container">
        <div class="contact-grid">
            <div class="contact-info-panel">
                <h2><?php esc_html_e('Contattaci', 'studio-legale-mandroneniglio'); ?></h2>
                <p class="contact-intro"><?php esc_html_e('Siamo a tua disposizione per qualsiasi chiarimento o consulenza. Compila il form o utilizza uno dei seguenti recapiti.', 'studio-legale-mandroneniglio'); ?></p>

                <div class="contact-details">
                    <div class="contact-detail">
                        <div class="detail-icon"><i class="fas fa-map-marker-alt"></i></div>
                        <div>
                            <h4><?php esc_html_e('Indirizzo', 'studio-legale-mandroneniglio'); ?></h4>
                            <p>Via dei Giureconsulti, 25<br>00186 Roma</p>
                        </div>
                    </div>
                    <div class="contact-detail">
                        <div class="detail-icon"><i class="fas fa-phone"></i></div>
                        <div>
                            <h4><?php esc_html_e('Telefono', 'studio-legale-mandroneniglio'); ?></h4>
                            <p><a href="tel:+390612345678">+39 06 12345678</a></p>
                        </div>
                    </div>
                    <div class="contact-detail">
                        <div class="detail-icon"><i class="fas fa-fax"></i></div>
                        <div>
                            <h4><?php esc_html_e('Fax', 'studio-legale-mandroneniglio'); ?></h4>
                            <p>+39 06 12345679</p>
                        </div>
                    </div>
                    <div class="contact-detail">
                        <div class="detail-icon"><i class="fas fa-envelope"></i></div>
                        <div>
                            <h4><?php esc_html_e('Email', 'studio-legale-mandroneniglio'); ?></h4>
                            <p><a href="mailto:info@studiolegalemandroneniglio.it">info@studiolegalemandroneniglio.it</a></p>
                        </div>
                    </div>
                    <div class="contact-detail">
                        <div class="detail-icon"><i class="fas fa-clock"></i></div>
                        <div>
                            <h4><?php esc_html_e('Orari', 'studio-legale-mandroneniglio'); ?></h4>
                            <p><?php esc_html_e('Lunedì - Venerdì: 09:00 - 19:00', 'studio-legale-mandroneniglio'); ?><br>
                            <?php esc_html_e('Sabato: 09:00 - 13:00 (solo su appuntamento)', 'studio-legale-mandroneniglio'); ?></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="contact-form-panel">
                <?php
                while (have_posts()) :
                    the_post();
                    the_content();
                endwhile;
                ?>
                <form class="slm-contact-form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                    <div class="form-row">
                        <div class="form-field">
                            <label for="contact_name"><?php esc_html_e('Nome *', 'studio-legale-mandroneniglio'); ?></label>
                            <input type="text" id="contact_name" name="contact_name" required>
                        </div>
                        <div class="form-field">
                            <label for="contact_email"><?php esc_html_e('Email *', 'studio-legale-mandroneniglio'); ?></label>
                            <input type="email" id="contact_email" name="contact_email" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-field">
                            <label for="contact_phone"><?php esc_html_e('Telefono', 'studio-legale-mandroneniglio'); ?></label>
                            <input type="tel" id="contact_phone" name="contact_phone">
                        </div>
                        <div class="form-field">
                            <label for="contact_subject"><?php esc_html_e('Oggetto *', 'studio-legale-mandroneniglio'); ?></label>
                            <select id="contact_subject" name="contact_subject" required>
                                <option value="">— <?php esc_html_e('Seleziona', 'studio-legale-mandroneniglio'); ?> —</option>
                                <option value="civile"><?php esc_html_e('Diritto Civile', 'studio-legale-mandroneniglio'); ?></option>
                                <option value="penale"><?php esc_html_e('Diritto Penale', 'studio-legale-mandroneniglio'); ?></option>
                                <option value="amministrativo"><?php esc_html_e('Diritto Amministrativo', 'studio-legale-mandroneniglio'); ?></option>
                                <option value="famiglia"><?php esc_html_e('Diritto di Famiglia', 'studio-legale-mandroneniglio'); ?></option>
                                <option value="lavoro"><?php esc_html_e('Diritto del Lavoro', 'studio-legale-mandroneniglio'); ?></option>
                                <option value="societario"><?php esc_html_e('Diritto Societario', 'studio-legale-mandroneniglio'); ?></option>
                                <option value="altro"><?php esc_html_e('Altro', 'studio-legale-mandroneniglio'); ?></option>
                            </select>
                        </div>
                    </div>
                    <div class="form-field">
                        <label for="contact_message"><?php esc_html_e('Messaggio *', 'studio-legale-mandroneniglio'); ?></label>
                        <textarea id="contact_message" name="contact_message" rows="8" required></textarea>
                    </div>
                    <div class="form-field">
                        <label class="checkbox-label">
                            <input type="checkbox" name="contact_privacy" required>
                            <?php esc_html_e('Ho letto e accetto la privacy policy *', 'studio-legale-mandroneniglio'); ?>
                        </label>
                    </div>
                    <div class="form-field">
                        <?php wp_nonce_field('slm_contact_form', 'slm_contact_nonce'); ?>
                        <input type="hidden" name="action" value="slm_contact_form">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="fas fa-paper-plane"></i> <?php esc_html_e('Invia Messaggio', 'studio-legale-mandroneniglio'); ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="contact-map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.585!2d12.476!3d41.901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDU0JzAzLjYiTiAxMsKwMjgnMzMuNiJF!5e0!3m2!1sit!2sit!4v1" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
    </div>
</main>

<?php get_footer(); ?>
