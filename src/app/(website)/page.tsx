"use server";
import { LATO } from "@/lib/helper";
import Header from "../../components/global/global-header";
import Hero from "./_components/hero-section";
import TrustBadges from "./_components/trust-badges";
import ShopByCategory from "./_components/categories-section";
import FeaturedProducts from "./_components/featured-products";
import AboutBanner from "./_components/about-section";
import Benefits from "./_components/benefits-section";
import Testimonials from "./_components/testimonials-section";
// import OfferBanner from "./_components/offer-banner";
import InstagramFeed from "./_components/insta-feed-section";
import Blog from "./_components/blog-section";
import Newsletter from "./_components/newsletter-section";
import Footer from "./_components/footer";
import { getSession } from "@/lib/auth";

const HomePage = async () => {
  const session = await getSession();
  return (
    <div className="min-h-screen" style={{ fontFamily: LATO }}>
      <Header />
      <main>
        <Hero />
        <TrustBadges />
        <ShopByCategory isLoggedIn={session.loggedIn} />
        <AboutBanner />
        <FeaturedProducts isLoggedIn={session.loggedIn} />
        <Benefits />
        <Testimonials />
        {/* <OfferBanner /> */}
        <InstagramFeed />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
