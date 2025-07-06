import React from 'react';
import styles from './Header.module.css';

// React Icons
import { BsPhone, BsEnvelope } from 'react-icons/bs'; // Ícones de telefone e email
import { BsTiktok } from 'react-icons/bs'; // Ícone do TikTok
import { FaFacebookF, FaInstagram } from 'react-icons/fa'; // Ícones do Facebook e Instagram

const HeaderTopBar = () => {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarContent}>
        <div className={styles.topBarContact}>
          <a href="tel:+5511954728628" className={styles.topBarLink}>
            <BsPhone className={styles.topBarIcon} />
            <span>(11) 95472-8628</span>
          </a>
          <a href="mailto:contato@doodledreams.com.br" className={styles.topBarLink}>
            <BsEnvelope className={styles.topBarIcon} />
            <span>contato@doodledreams.com.br</span>
          </a>
        </div>
        <div className={styles.topBarSocial}>
          <a href="#" className={styles.topBarSocialLink} aria-label="TikTok">
            <BsTiktok />
          </a>
          <a href="#" className={styles.topBarSocialLink} aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" className={styles.topBarSocialLink} aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderTopBar;