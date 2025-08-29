<script setup lang="ts">
import { computed } from "vue";
import projectImage1 from "@/assets/Project1 (1).jpg";
import projectImage2 from "@/assets/Project1 (2).jpg";
import projectImage3 from "@/assets/Project1 (3).jpg";
import projectImage4 from "@/assets/Project1 (4).jpg";
import projectImage5 from "@/assets/Project1 (5).jpg";
import projectImage6 from "@/assets/Project1 (6).jpg";
import projectImage7 from "@/assets/Project1 (7).jpg";
import projectImage8 from "@/assets/Project2 (1).jpg";
import projectImage9 from "@/assets/Project2 (2).jpg";
import projectImage10 from "@/assets/Project2 (3).jpg";
import projectImage11 from "@/assets/Project2 (4).jpg";
import projectImage12 from "@/assets/Project3 (1).jpg";
import projectImage13 from "@/assets/Project3 (2).jpg";
import projectImage14 from "@/assets/Project3 (3).jpg";
import projectImage15 from "@/assets/Project3 (4).jpg";
import projectImage16 from "@/assets/Project3 (5).jpg";
import projectImage17 from "@/assets/Project3 (6).jpg";
import projectImage18 from "@/assets/Project3 (7).jpg";
import projectImage19 from "@/assets/Project3 (8).jpg";
import projectImage20 from "@/assets/Project4 (1).jpg";
import industrialImage1 from "@/assets/Project5 (1).jpg";
import industrialImage2 from "@/assets/Project6 (1).jpg";
import industrialImage3 from "@/assets/Project7 (1).jpg";
import industrialImage4 from "@/assets/Project8 (1).jpg";
import industrialImage5 from "@/assets/Project9 (1).jpg";
import industrialImage6 from "@/assets/Project10 (1).jpg";
import industrialImage7 from "@/assets/Project11 (1).jpg";
import industrialImage8 from "@/assets/Project12 (1).jpg";
import drivewayImage1 from "@/assets/Project13 (1).jpg";
import drivewayImage2 from "@/assets/Project13 (2).jpg";
import drivewayImage3 from "@/assets/Project13 (3).jpg";
import drivewayImage4 from "@/assets/Project13 (4).jpg";
import drivewayImage5 from "@/assets/Project13 (5).jpg";
import drivewayImage6 from "@/assets/Project13 (6).jpg";
import drivewayImage7 from "@/assets/Project13 (7).jpg";

import {
  LocalPhoneFilled,
  PhoneIphoneRound,
  LocationOnFilled,
  EmailFilled,
} from "@vicons/material";

/**
 * The constant `numberOfImages` specifies the total number of images
 * to be used or displayed in the component.
 */
const numberOfImages = 6;

const refurbishmentImages = computed(() => {
  const allImages = [
    projectImage1,
    projectImage2,
    projectImage3,
    projectImage4,
    projectImage5,
    projectImage6,
    projectImage7,
    projectImage8,
    projectImage9,
    projectImage10,
    projectImage11,
    projectImage12,
    projectImage13,
    projectImage14,
    projectImage15,
    projectImage16,
    projectImage17,
    projectImage18,
    projectImage19,
    projectImage20,
  ];
  const shuffled = allImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfImages);
});

const industrialImages = computed(() => {
  const allImages = [
    industrialImage1,
    industrialImage2,
    industrialImage3,
    industrialImage4,
    industrialImage5,
    industrialImage6,
    industrialImage7,
    industrialImage8,
  ];
  const shuffled = allImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfImages);
});

const drivewayImages = computed(() => {
  const allImages = [
    drivewayImage1,
    drivewayImage2,
    drivewayImage3,
    drivewayImage4,
    drivewayImage5,
    drivewayImage6,
    drivewayImage7,
  ];
  const shuffled = allImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numberOfImages);
});
</script>

<template>
  <section class="hero">
    <div class="hero-content">
      <h1>Building a Sustainable Future</h1>
      <p>Excellence in Construction & Electrical Services</p>
    </div>
  </section>

  <section class="about" id="about">
    <div class="section-title">
      <h2>About TerraBuild</h2>
    </div>
    <p>
      At Donal O'Leary Electrical trading as TerraBuild, we have evolved from
      our origins as electrical contractors to become a versatile company
      dedicated to professionalism, environmental sustainability, and community
      engagement. We prioritize eco-friendly practices to minimize our
      environmental impact. Additionally, our active involvement in local
      communities reflects our commitment to fostering meaningful partnerships
      and contributing positively to the areas we serve.
    </p>
  </section>

  <section class="memberships" id="memberships">
    <div class="section-title">
      <h2>Our Memberships</h2>
    </div>
    <div class="memberships-grid">
      <img
        class="memberships-logo"
        src="../assets/ciri-logo.png"
        alt="CIRI logo"
      />
      <img
        class="memberships-logo"
        src="../assets/guild-of-master-craftsmen-logo.webp"
        alt="Guild of Master Craftsmen logo"
      />
      <img
        class="memberships-logo"
        src="../assets/apea-logo.svg"
        alt="APEA logo"
      />
      <img
        class="memberships-logo"
        src="../assets/cif-logo.png"
        alt="Construction Industry Federation logo"
      />
    </div>
  </section>
  <div class="section-title">
    <h2>Our Work</h2>
  </div>
  <section class="work" id="work">
    <n-tabs type="segment" animated id="mobile-images">
      <n-tab-pane name="refurbishments" tab="Refurbishments">
        <div class="projects-grid">
          <n-image-group>
            <n-space justify="center">
              <n-image
                v-for="url in refurbishmentImages"
                :src="url"
                object-fit="cover"
                width="300"
                height="400"
              />
            </n-space>
          </n-image-group>
        </div>
      </n-tab-pane>
      <n-tab-pane name="driveways" tab="Driveways">
        <div class="projects-grid">
          <n-image-group>
            <n-space justify="center">
              <n-image
                v-for="url in drivewayImages"
                :src="url"
                object-fit="cover"
                width="300"
                height="400"
              />
            </n-space>
          </n-image-group>
        </div>
      </n-tab-pane>
      <n-tab-pane name="industrial" tab="Industrial">
        <div class="projects-grid">
          <n-image-group>
            <n-space justify="center">
              <n-image
                v-for="url in industrialImages"
                :src="url"
                object-fit="cover"
                width="300"
                height="400"
              />
            </n-space>
          </n-image-group>
        </div>
      </n-tab-pane>
    </n-tabs>
    <n-carousel
      id="desktop-images"
      effect="card"
      prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
      next-slide-style="transform: translateX(50%) translateZ(-800px);"
      style="height: 100vh"
      :show-dots="false"
      :autoplay="true"
    >
      <n-carousel-item :style="{ width: '60%' }">
        <div class="projects-grid">
          <n-image-group>
            <n-space justify="center">
              <n-image
                v-for="url in refurbishmentImages"
                :src="url"
                object-fit="cover"
                width="300"
                height="400"
              />
            </n-space>
          </n-image-group>
        </div>
      </n-carousel-item>
      <n-carousel-item :style="{ width: '60%' }">
        <div class="projects-grid">
          <n-image-group>
            <n-space justify="center">
              <n-image
                v-for="url in drivewayImages"
                :src="url"
                object-fit="cover"
                width="300"
                height="400"
              />
            </n-space>
          </n-image-group>
        </div>
      </n-carousel-item>
      <n-carousel-item :style="{ width: '60%' }">
        <div class="projects-grid">
          <n-image-group>
            <n-space justify="center">
              <n-image
                v-for="url in industrialImages"
                :src="url"
                object-fit="cover"
                width="300"
                height="400"
              />
            </n-space>
          </n-image-group>
        </div>
      </n-carousel-item>
    </n-carousel>
  </section>

  <section class="contact" id="contact">
    <div class="section-title">
      <h2>Contact Us</h2>
    </div>
    <div class="contact-grid">
      <div class="enquiry-container">
        <h3>Make an Enquiry</h3>
        <iframe
          src="https://tradehq.com/olearyelec/enquire"
          loading="lazy"
          title="Enquiry Form"
        >
        </iframe>
      </div>

      <div class="contact-info">
        <h3>Get in Touch</h3>
        <p>
          <n-icon size="20"><email-filled /></n-icon>
          <strong>Email:</strong>
          <a href="mailto:enquiries@terrabuild.ie">enquiries@terrabuild.ie</a>
        </p>

        <div class="phone-numbers">
          <p><strong>Phone:</strong></p>
          <p>
            <n-icon size="20"><phone-iphone-round /></n-icon>
            <strong>Donal:</strong>
            <a href="tel:0872838894">087 283 8894</a>
          </p>
          <p>
            <n-icon size="20"><phone-iphone-round /></n-icon>
            <strong>Patricia:</strong>
            <a href="tel:0878126549">087 812 6549</a>
          </p>
          <p>
            <n-icon size="20"><local-phone-filled /></n-icon>
            <strong>Telephone:</strong>
            <a href="tel:0238839474">023 8839 474</a>
          </p>
        </div>

        <h3>Address</h3>
        <p>
          <n-icon size="20"><location-on-filled /></n-icon>
          Laws Cross, Ahalisky, Ballinascarthy, Clonakilty, Co. Cork, P85 PP93
        </p>

        <h3 class="service-areas">Service Areas</h3>
        <p class="service-areas">
          We are based in West Cork but operate throughout Ireland, including:
        </p>
        <p class="locations service-areas">
          Cork • Limerick • Waterford • Kerry • Galway • Dublin • More...
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9894.200621948483!2d-8.847461216656148!3d51.68637669967105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x484457ff7fa97b93%3A0x497212848aa36000!2sAhalisky%2C%20Co.%20Cork%2C%20P85%20PP93!5e0!3m2!1sen!2sie!4v1705356054738!5m2!1sen!2sie"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Google Maps"
          id="map"
          style="height: 50rem; padding-top: 2em"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 80vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("../assets/Background1.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 5%;
}

p {
  font-size: 1.2em;
}

.hero-content h1 {
  font-family: "Allerta Stencil", sans-serif;
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

section {
  padding: 5rem 5%;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.projects {
  background: var(--light);
  text-align: center;
}

.projects-grid {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.projects-grid .n-image {
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.projects-grid .n-image:hover {
  transform: scale(1.1);
}

.memberships {
  background: white;
  text-align: center;
}

.memberships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  align-items: center;
  margin-top: 3rem;
}

.memberships-logo {
  max-width: 150px;
  height: auto;
  transition: transform 0.3s;
}

.memberships-logo:hover {
  transform: scale(1.1);
}

.contact {
  background: var(--light);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
}

.contact-info,
.enquiry-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.contact-info {
  padding: 4em;
}

.enquiry-container {
  width: 100%;
  padding-top: 4em;
  padding-left: 0em;
  padding-right: 0em;
  padding-bottom: 0em;
  border-radius: 10px;
  overflow: hidden;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}

@media (max-width: 600px) {
  #map,
  .service-areas {
    display: none;
  }

  .enquiry-container {
    height: 150vh;
  }
  #desktop-images {
    display: none;
  }
}
@media (min-width: 601px) {
  #mobile-images {
    display: none;
  }
}
</style>
