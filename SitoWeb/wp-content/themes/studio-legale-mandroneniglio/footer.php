    <footer id="colophon" class="site-footer">
        <div class="footer-widgets">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <?php if (is_active_sidebar('footer-1')) : ?>
                            <?php dynamic_sidebar('footer-1'); ?>
                        <?php else : ?>
                            <div class="footer-logo">
                                <h3><?php bloginfo('name'); ?></h3>
                                <p><?php esc_html_e('Consulenza legale professionale nei settori del diritto civile, penale e amministrativo.', 'studio-legale-mandroneniglio'); ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="footer-col">
                        <?php if (is_active_sidebar('footer-2')) : ?>
                            <?php dynamic_sidebar('footer-2'); ?>
                        <?php else : ?>
                            <h4 class="footer-title"><?php esc_html_e('Contatti', 'studio-legale-mandroneniglio'); ?></h4>
                            <ul class="footer-contact">
                                <li><i class="fas fa-map-marker-alt"></i> Via dei Giureconsulti, 25 - 00186 Roma</li>
                                <li><i class="fas fa-phone"></i> +39 06 12345678</li>
                                <li><i class="fas fa-fax"></i> +39 06 12345679</li>
                                <li><i class="fas fa-envelope"></i> info@studiolegalemandroneniglio.it</li>
                                <li><i class="fas fa-clock"></i> Lun-Ven: 09:00 - 19:00</li>
                            </ul>
                        <?php endif; ?>
                    </div>
                    <div class="footer-col">
                        <?php if (is_active_sidebar('footer-3')) : ?>
                            <?php dynamic_sidebar('footer-3'); ?>
                        <?php else : ?>
                            <h4 class="footer-title"><?php esc_html_e('Aree di Diritto', 'studio-legale-mandroneniglio'); ?></h4>
                            <ul class="footer-links">
                                <li><a href="<?php echo esc_url(home_url('/diritto-civile')); ?>"><?php esc_html_e('Diritto Civile', 'studio-legale-mandroneniglio'); ?></a></li>
                                <li><a href="<?php echo esc_url(home_url('/diritto-penale')); ?>"><?php esc_html_e('Diritto Penale', 'studio-legale-mandroneniglio'); ?></a></li>
                                <li><a href="<?php echo esc_url(home_url('/diritto-amministrativo')); ?>"><?php esc_html_e('Diritto Amministrativo', 'studio-legale-mandroneniglio'); ?></a></li>
                                <li><a href="<?php echo esc_url(home_url('/diritto-di-famiglia')); ?>"><?php esc_html_e('Diritto di Famiglia', 'studio-legale-mandroneniglio'); ?></a></li>
                                <li><a href="<?php echo esc_url(home_url('/diritto-del-lavoro')); ?>"><?php esc_html_e('Diritto del Lavoro', 'studio-legale-mandroneniglio'); ?></a></li>
                            </ul>
                        <?php endif; ?>
                    </div>
                    <div class="footer-col">
                        <?php if (is_active_sidebar('footer-4')) : ?>
                            <?php dynamic_sidebar('footer-4'); ?>
                        <?php else : ?>
                            <h4 class="footer-title"><?php esc_html_e('Seguici', 'studio-legale-mandroneniglio'); ?></h4>
                            <div class="social-links">
                                <a href="#" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                                <a href="#" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                                <a href="#" class="social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                                <a href="#" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                            </div>
                            <div class="footer-newsletter">
                                <h4><?php esc_html_e('Newsletter', 'studio-legale-mandroneniglio'); ?></h4>
                                <p><?php esc_html_e('Ricevi aggiornamenti legali', 'studio-legale-mandroneniglio'); ?></p>
                                <form class="newsletter-form" action="#" method="post">
                                    <input type="email" placeholder="<?php esc_attr_e('La tua email', 'studio-legale-mandroneniglio'); ?>" required>
                                    <button type="submit"><i class="fas fa-paper-plane"></i></button>
                                </form>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <p class="copyright">
                        &copy; <?php echo date('Y'); ?> <strong><?php bloginfo('name'); ?></strong>.
                        <?php esc_html_e('Tutti i diritti riservati.', 'studio-legale-mandroneniglio'); ?>
                        <span class="sep">|</span>
                        <a href="<?php echo esc_url(home_url('/privacy-policy')); ?>"><?php esc_html_e('Privacy Policy', 'studio-legale-mandroneniglio'); ?></a>
                        <span class="sep">|</span>
                        <a href="<?php echo esc_url(home_url('/cookie-policy')); ?>"><?php esc_html_e('Cookie Policy', 'studio-legale-mandroneniglio'); ?></a>
                    </p>
                    <p class="credits">
                        <?php esc_html_e('Studio Legale Mandroneniglio - P.IVA 01234567890', 'studio-legale-mandroneniglio'); ?>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</div>

<?php wp_footer(); ?>
</body>
</html>
