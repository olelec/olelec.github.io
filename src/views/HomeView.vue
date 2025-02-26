<script setup lang="ts"></script>

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

  <section class="contact" id="contact">
    <div class="section-title">
      <h2>Contact Us</h2>
    </div>
    <div class="contact-grid">
      <div class="contact-info">
        <h3>Get in Touch</h3>
        <p>
          <strong>Email:</strong>
          <a href="mailto:patricia@terrabuild.ie">patricia@terrabuild.ie</a>
        </p>

        <div class="phone-numbers">
          <p><strong>Phone:</strong></p>
          <p>
            📞 <strong>Donal:</strong> <a href="tel:0872838894">087 283 8894</a>
          </p>
          <p>
            📞 <strong>Patricia:</strong>
            <a href="tel:0878126549">087 812 6549</a>
          </p>
          <p>
            📞 <strong>Telephone:</strong>
            <a href="tel:0238839474">023 8839 474</a>
          </p>
        </div>

        <h3>Address</h3>
        <p>
          📍 Laws Cross, Ahalisky, Ballinascarthy, Clonakilty, Co. Cork, P85
          PP93
        </p>

        <h3>Service Areas</h3>
        <p>
          We are based in West Cork but operate throughout Ireland, including:
        </p>
        <p class="locations">
          Cork • Limerick • Waterford • Kerry • Galway • Dublin • More...
        </p>
      </div>

      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9894.200621948483!2d-8.847461216656148!3d51.68637669967105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x484457ff7fa97b93%3A0x497212848aa36000!2sAhalisky%2C%20Co.%20Cork%2C%20P85%20PP93!5e0!3m2!1sen!2sie!4v1705356054738!5m2!1sen!2sie"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Google Maps"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  height: 80vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  padding: 0 5%;
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

.about {
  background: var(--light);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-10px);
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

.contact-info {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.phone-numbers p,
.locations {
  margin: 5px 0;
}

a {
  text-decoration: none;
  color: #0073e6;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}

.map-container {
  width: 100%;
  height: 450px;
  border-radius: 10px;
  overflow: hidden;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}

footer {
  background: var(--secondary);
  color: white;
  padding: 2rem 5%;
  text-align: center;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  section {
    padding: 3rem 5%;
  }
}
</style>
