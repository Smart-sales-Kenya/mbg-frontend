import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, Briefcase, TrendingUp, Users } from "lucide-react";
import aboutImage from "@/assets/about-team.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import ceoImage from "@/assets/ceo-edward-ndegwa.jpg";

const About = () => {
  const values = [
  {
    icon: Award,
    title: "Fairness",
    description:
      "We believe every African business deserves an equal opportunity to succeed. We operate with transparency and integrity, ensuring access to markets and opportunities is open and just for all.",
  },
  {
    icon: Users,
    title: "Empowerment",
    description:
      "We exist to uplift others — equipping entrepreneurs and youth with the tools, knowledge, and confidence to grow, innovate, and lead change in their communities.",
  },
  {
    icon: Briefcase,
    title: "Collaboration",
    description:
      "We grow stronger together. By connecting businesses, communities, and partners, we create a supportive ecosystem where shared success fuels collective progress.",
  },
  {
    icon: Target,
    title: "Community Impact",
    description:
      "We measure success by the lives we touch — from the jobs created to the families sustained and the local economies revitalized. Every action we take is guided by purpose and people.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We embrace creativity and forward thinking, using new ideas and technologies to unlock opportunities and drive sustainable growth across Africa.",
  },
  {
    icon: Award,
    title: "Integrity",
    description:
      "We are honest, reliable, and accountable in all we do — building trust through consistency, respect, and a deep commitment to our vision for Africa’s future.",
  },
];

  const partners = Array.from({ length: 19 }, (_, i) => ({
    logo: `/partners/Picture${i + 1}.${[6, 15].includes(i + 1) ? "jpg" : "png"}`,
    alt: `Partner logo ${i + 1}`,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Sales Excellence Across Africa
            </h1>
            <p className="text-xl text-primary-foreground/90">
              At MBG, we transform businesses through proven sales training
              methodologies and dedicated coaching that delivers real, measurable
              results.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Our Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img
                src={aboutImage}
                alt="MBG Team"
                className="rounded-lg shadow-elegant w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Mastering Business Growth (MBG) was founded with a clear
                  mission: to build sales capability that drives sustainable
                  business growth across Africa. We recognized that many
                  organizations struggled not from lack of products or markets,
                  but from inadequate sales structures, processes, and
                  capabilities.
                </p>
                <p>
                  Over the years, we've worked with businesses of all sizes—from
                  ambitious SMEs to established corporations—helping them
                  transform their sales approach from reactive order-taking to
                  strategic, value-based selling.
                </p>
                <p>
                  Today, MBG stands as a trusted partner to leading organizations
                  across multiple sectors, with a track record of delivering
                  measurable improvements in sales performance, team capability,
                  and business growth.
                </p>
              </div>
            </div>
          </div>

          {/* Philosophy Statement */}
          <div className="bg-muted/30 rounded-lg p-8 md:p-12 mb-20">
            <h2 className="text-3xl font-bold mb-6 text-center">Philosophy Statement</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-center text-muted-foreground text-lg">
              <p>
                Africa’s economic transformation begins with empowering its small and medium enterprises (SMEs) — the true engines of growth and innovation. We recognize that behind every small business is an entrepreneur with the potential to create jobs, drive local value chains, and inspire sustainable prosperity within communities.
              </p>
              <p>
                We are on a mission to bridge this opportunity gap by providing African businesses with the sales capability tools, networks, and market access they need to compete and thrive — in the country and across Africa. We believe that when African enterprises are given a fair chance through access to the right talent, they can stand shoulder to shoulder with the best in the world.
              </p>
              <p>
                At the heart of our work is a deep commitment to job creation and youth empowerment. Africa’s young population is its greatest asset, and by helping SMEs grow, we unlock pathways for meaningful employment and skill development.
              </p>
              <p>
                Success is not only in sales, but in the number of lives improved, businesses scaled, and communities uplifted.
              </p>
              <p className="font-semibold text-foreground">
                We believe that when African businesses succeed, Africa thrives — and our mission is to make that success both possible and sustainable.
              </p>
            </div>
          </div>

          {/* Vision & Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-primary/10 rounded-lg p-8 shadow-elegant">
              <h2 className="text-3xl font-bold mb-4 text-primary text-center">
                Vision Statement
              </h2>
              <p className="text-muted-foreground text-lg text-center">
                To build a thriving continent — Africa — where African businesses
                have a fair chance to succeed, creating sustainable growth and
                employment opportunities for the continent’s growing youth
                population.
              </p>
            </div>

            <div className="bg-accent/10 rounded-lg p-8 shadow-elegant">
              <h2 className="text-3xl font-bold mb-4 text-accent text-center">
                Mission Statement
              </h2>
              <p className="text-muted-foreground text-lg text-center">
                To empower small and medium-sized African enterprises by
                providing them with sales support, market access, and growth tools
                that enable them to compete, expand, and create jobs.
              </p>
              <p className="text-muted-foreground text-lg text-center mt-4">
                We are committed to promoting fairness, collaboration, and
                innovation — bridging the gap between African businesses and the
                opportunities they deserve, while driving inclusive economic
                development across the continent.
              </p>
            </div>
          </div>

          {/* Alternate Vision & Mission Section */}
          <div className="bg-muted/40 rounded-lg p-8 md:p-12 mb-20 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              To see an Africa where every local business has the opportunity to
              grow, create jobs, and inspire hope — building a continent where
              prosperity is shared, and success is born from within our
              communities.
            </p>

            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our mission is to champion the growth of Africa’s small and medium
              businesses by opening doors to markets, customers, and opportunities
              by giving them access to the best sales and marketing talent. We
              work every day to ensure African businesses are seen, supported, and
              given a fair chance to succeed — because when they rise, we all rise
              together.
            </p>
          </div>

          {/* Values */}
<div className="mb-20">
  <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {values.map((value, index) => {
      const Icon = value.icon;
      return (
        <Card
          key={index}
          className="shadow-elegant transition-all text-center"
        >
          <CardContent className="pt-6">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
              <Icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {value.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {value.description}
            </p>
          </CardContent>
        </Card>
      );
    })}
  </div>
</div>


          {/* CEO Profile */}
          <div className="bg-secondary/50 rounded-lg p-8 md:p-12 mb-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
                Meet Our Founder
              </h2>
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* CEO Image */}
                <div className="flex justify-center md:justify-start">
                  <img
                    src={ceoImage}
                    alt="Edward Ndegwa - CEO"
                    className="rounded-2xl shadow-lg w-64 h-64 object-cover border-4 border-primary/20"
                  />
                </div>

                {/* CEO Text */}
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-semibold mb-2">Edward Ndegwa</h3>
                  <p className="text-accent mb-4 font-medium">
                    CEO & Lead Facilitator
                  </p>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Edward Ndegwa is a seasoned sales capability expert with
                      over a decade of experience transforming sales
                      organizations across Africa. His passion for building
                      high-performing sales teams and sustainable growth
                      strategies has made him a sought-after coach and trainer.
                    </p>
                    <p>
                      Through MBG, Edward has trained hundreds of sales
                      professionals and worked with leading organizations to
                      implement strategic sales transformations. His practical,
                      results-driven approach combines deep industry knowledge
                      with proven methodologies.
                    </p>
                    <p>
                      Edward is also a regular speaker at sales conferences and
                      webinars, sharing insights on modern sales leadership,
                      strategic selling, and team performance optimization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex justify-center md:justify-end mt-10">
                <div className="bg-primary/5 rounded-lg p-6 text-center w-64">
                  <div className="text-4xl font-bold text-primary mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">
                    Years of Experience
                  </div>
                  <div className="text-4xl font-bold text-accent mb-2 mt-4">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Professionals Trained
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partners Carousel */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Trusted By Leading Organizations
            </h2>
            <Swiper
              spaceBetween={30}
              slidesPerView={2}
              loop={true}
              modules={[Autoplay]}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              speed={4000}
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 6 },
              }}
              className="mySwiper"
            >
              {partners.map((partner, index) => (
                <SwiperSlide key={index}>
                  <div className="flex items-center justify-center p-6">
                    <img
                      src={partner.logo}
                      alt={`Partner logo ${index + 1}`}
                      className="h-16 w-auto object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
