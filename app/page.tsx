"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, ArrowRight, Star, Zap, BarChart, Globe, Brain, Languages, LifeBuoy, X, Play, Users, FileText, Search, Briefcase, GraduationCap, MessageSquare, Code, Plane, Wallet, Shield, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"
// import AnnouncementBanner from "@/components/announcement-banner"

export default function LandingPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "ქართული, როგორც მშობლიური",
      description: "ბუნებრივი სტილი, სწორი ტერმინოლოგია.",
      icon: <Languages className="size-6 stroke-[1.5]" />,
    },
    {
      title: "ვებ-ძიება რეალურ დროში",
      description: "პასუხები წყაროებითა და სწრაფი fact-check-ით.",
      icon: <Search className="size-6 stroke-[1.5]" />,
    },
    {
      title: "ფაილების ღრმა ანალიზი",
      description: "დიდი PDFs/დოკები → შეჯამება, ცხრილები, ინსაითები.",
      icon: <FileText className="size-6 stroke-[1.5]" />,
    },
    {
      title: "მრავალმოდელა არჩევანი",
      description: "Light/Pro/Ultra სიჩქარისა და სიღრმისთვის.",
      icon: <Layers className="size-6 stroke-[1.5]" />,
    },
    {
      title: "კონფიდენციალურობა",
      description: "ფაილების/ჩათების წაშლა და კონტროლი შენს ხელშია.",
      icon: <Shield className="size-6 stroke-[1.5]" />,
    },
    {
      title: "24/7 მხარდაჭერა",
      description: "მზად ვართ, როცა დაგჭირდება.",
      icon: <LifeBuoy className="size-6 stroke-[1.5]" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* <AnnouncementBanner /> */}
      <Header />
      <main className="flex-1 relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#171717] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-tight">
                MyPen — შენი ქართული AI ასისტენტი
              </h1>

              {/* Social Proof Chip */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2" variant="secondary">
                  <Users className="size-4" />
                  10,000+ კმაყოფილი მომხმარებელი
                </Badge>
              </div>

              <p className="text-base md:text-lg text-muted-foreground mb-5 max-w-[70ch] mx-auto leading-relaxed">
                იპოვე სამუშაო, მიიღე პასუხები ნებისმიერ თემაზე, გაანალიზე ფაილები და წერე ქართულად — ერთ სივრცეში.
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <Badge className="rounded-full px-3 py-1 text-xs font-medium" variant="outline">
                  ქართული 100%
                </Badge>
                <Badge className="rounded-full px-3 py-1 text-xs font-medium" variant="outline">
                  ვებ-ძიება
                </Badge>
                <Badge className="rounded-full px-3 py-1 text-xs font-medium" variant="outline">
                  ფაილების ანალიზი
                </Badge>
                <Badge className="rounded-full px-3 py-1 text-xs font-medium" variant="outline">
                  სწრაფი პასუხები
                </Badge>
              </div>

              {/* CTAs with more white space */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    size="lg"
                    className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
                    asChild
                  >
                    <Link href="https://chat.mypen.ge">
                      დაიწყე უფასოდ
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <span className="text-xs text-muted-foreground">საკრედიტო ბარათი არ არის საჭირო</span>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base transition-all hover:scale-105"
                  asChild
                >
                  <a href="#how-it-works">
                    <Play className="mr-2 size-4" />
                    იხილე როგორ მუშაობს
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="relative mx-auto max-w-4xl mt-8"
            >
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <Image
                  src="/images/mypen-hero-dashboard.webp"
                  width={1280}
                  height={720}
                  alt="Mypen.ge dashboard interface with AI assistant"
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        {/* Logos Section */}

        {/* Features Section - რატომ MyPen */}
        <section id="features" className="w-full py-20 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                რატომ MyPen
              </h2>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-12"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md hover:border-primary/50">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section - რას აკეთებს */}
        <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">რას აკეთებს</h2>
            </motion.div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto mb-12">
              {[
                {
                  title: "სამუშაოს მოძებნა",
                  description: "რეზიუმე, cover letter, ვაკანსიები და გასაუბრების კითხვები.",
                  icon: <Briefcase className="size-5 stroke-[1.5]" />,
                },
                {
                  title: "ფაილების ანალიზი",
                  description: "PDF/DOCX/სურათი → შეჯამება და მთავარი ინსაითები წამებში.",
                  icon: <FileText className="size-5 stroke-[1.5]" />,
                },
                {
                  title: "სწავლა & კვლევა",
                  description: "აუხსენი რთული თემა, მიიღე წყაროები და კონსპექტები.",
                  icon: <GraduationCap className="size-5 stroke-[1.5]" />,
                },
                {
                  title: "ყოველდღიური კითხვები",
                  description: "\"რა მოვამზადო?\", \"როგორ გავაკეთო?\" — სწრაფი, პრაქტიკული პასუხები.",
                  icon: <MessageSquare className="size-5 stroke-[1.5]" />,
                },
                {
                  title: "ბიზნეს დოკუმენტები",
                  description: "ბრეიფი, შეთავაზება, მონახაზი (იურკონსულტაცია არაა).",
                  icon: <Briefcase className="size-5 stroke-[1.5]" />,
                },
                {
                  title: "კოდირება",
                  description: "ახსნა, დებაგი, მოკლე სკრიპტები.",
                  icon: <Code className="size-5 stroke-[1.5]" />,
                },
                {
                  title: "მოგზაურობა",
                  description: "მარშრუტი, ბიუჯეტი, ლოკალური გაიდები.",
                  icon: <Plane className="size-5 stroke-[1.5]" />,
                },
                {
                  title: "ფინანსები",
                  description: "გეგმები, ჩექლისტები, ხარჯების ორგანიზება.",
                  icon: <Wallet className="size-5 stroke-[1.5]" />,
                },
              ].map((useCase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                >
                  <Link href="https://chat.mypen.ge" className="block h-full">
                    <Card className="h-full overflow-hidden border-border/40 bg-background/50 backdrop-blur transition-all hover:shadow-md hover:border-primary/50 group cursor-pointer">
                      <CardContent className="p-5">
                        <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-3">
                          {useCase.icon}
                        </div>
                        <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">{useCase.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-[35ch]">{useCase.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Inline CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center pt-4"
            >
              <Button
                size="lg"
                className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
                asChild
              >
                <Link href="https://chat.mypen.ge">
                  დაიწყე უფასოდ
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">როგორ მუშაობს</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative mb-12">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: "01",
                  title: "დარეგისტრირდი 60 წამში",
                  description: "ბარათი არ გჭირდება.",
                },
                {
                  step: "02",
                  title: "დაუსვი შეკითხვა ან ატვირთე ფაილი",
                  description: "ქართულად ან ნებისმიერ ენაზე.",
                },
                {
                  step: "03",
                  title: "მიიღე ზუსტი, მოკლე პასუხები",
                  description: "საჭიროებისას ვებ-წყაროებითა და ციტირებით.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center pt-4"
            >
              <Button
                size="lg"
                className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
                asChild
              >
                <Link href="https://chat.mypen.ge">
                  დაიწყე უფასოდ
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2" variant="secondary">
                <Users className="size-4" />
                10,000+ კმაყოფილი მომხმარებელი
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">გამოხმაურებები</h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[
                {
                  quote: "სამი მოდელი ერთ პლატფორმაზე - გაოცებული ვარ Mypen-ის მოქნილობით და სიმარტივით.",
                  author: "გიორგი ვ.",
                  role: "პროგრამული უზრუნველყოფის ინჟინერი",
                  rating: 5,
                },
                {
                  quote: "PRO პაკეტი სრულიად აკმაყოფილებს ჩვენს მოთხოვნებს და ზოგავს უამრავ დროს.",
                  author: "ნინო ე.",
                  role: "მცირე ბიზნესის მფლობელი",
                  rating: 5,
                },
                {
                  quote: "ULTRA მოდელი - ჩემი საიდუმლო იარაღი. შესანიშნავი კრეატიული პარტნიორი.",
                  author: "დავით ჩ.",
                  role: "მარკეტერი და ბლოგერი",
                  rating: 5,
                },
                {
                  quote: "უფასო ვერსია სრულად მყოფნის ყოველდღიური დავალებებისთვის. სტუდენტებისთვის იდეალური!",
                  author: "ანა გ.",
                  role: "უნივერსიტეტის სტუდენტი",
                  rating: 5,
                },
                {
                  quote: "PRO მოდელი ძლიერი და ჭკვიანია. ფასი სრულიად მისაღებია.",
                  author: "ლევან ს.",
                  role: "ფრილანსერი",
                  rating: 5,
                },
                {
                  quote: "Mypen-მა მოლოდინს გადააჭარბა. პასუხები ზუსტი და ბუნებრივია.",
                  author: "მარიამ რ.",
                  role: "პროექტის მენეჯერი",
                  rating: 5,
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex mb-4">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, j) => (
                            <Star key={j} className="size-4 text-yellow-500" />
                          ))}
                      </div>
                      <p className="mb-6 flex-grow text-sm">{testimonial.quote}</p>
                      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Testimonials CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center pt-8"
            >
              <Button
                size="lg"
                className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
                asChild
              >
                <Link href="https://chat.mypen.ge">
                  დაიწყე უფასოდ
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                მარტივი, გამჭვირვალე ფასები
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                თქვენს საჭიროებებზე მორგებული AI პაკეტები
              </h2>
              <p className="max-w-[70ch] text-muted-foreground md:text-lg mx-auto">
                მიუხედავად იმისა, ახლა იწყებთ თუ გჭირდებათ პროფესიონალური დონის AI ინსტრუმენტები, ჩვენ გვაქვს საფასო
                პაკეტი, რომელიც შეესაბამება თქვენს მოთხოვნებს
              </p>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1">
                    <TabsTrigger value="monthly" className="rounded-full px-6">
                      თვიურად
                    </TabsTrigger>
                    <TabsTrigger value="business" className="rounded-full px-6">
                      ბიზნესისთვის
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "MyPen Starter",
                        price: "უფასო",
                        description: "ყველა საბაზისო ინსტრუმენტი AI-სთან მუშაობის დასაწყებად.",
                        features: [
                          "Light მოდელი",
                          "ქართული წერა/თარგმნა",
                          "მცირე ფაილების ანალიზი",
                          "დღეში 20,000 ტოკენი",
                        ],
                        cta: "დაიწყე უფასოდ",
                      },
                      {
                        name: "MyPen Pro",
                        price: "₾24",
                        description: "მაღალი ხარისხის კონტენტის სწრაფად შესაქმნელად.",
                        features: [
                          "Pro + Light მოდელები",
                          "ვებ-ძიება რეალურ დროში",
                          "დიდი ფაილების ანალიზი",
                          "თვეში 250,000 ტოკენი",
                        ],
                        cta: "აირჩიე Pro",
                        popular: true,
                      },
                      {
                        name: "MyPen Ultra",
                        price: "₾52",
                        description: "შეუზღუდავი შემოქმედებისა და რთული ამოცანებისთვის.",
                        features: [
                          "Ultra მოდელი",
                          "ყველაზე სწრაფი პასუხები",
                          "შეუზღუდავი ტოკენები",
                          "ღრმა კვლევა და დიდი მოცულობები",
                        ],
                        cta: "აირჩიე Ultra",
                      },
                    ].map((plan, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <Card
                          className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                              ყველაზე პოპულარული
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">{plan.price}</span>
                              {plan.price !== "უფასო" && <span className="text-muted-foreground ml-1">/თვე</span>}
                            </div>
                            <p className="text-muted-foreground mt-2 max-w-[40ch]">{plan.description}</p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className="text-primary size-4 mr-2 flex-shrink-0" />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className="w-full mt-auto rounded-full transition-all hover:scale-105"
                              variant={plan.popular ? "default" : "outline"}
                              asChild
                            >
                              <Link href="https://chat.mypen.ge">{plan.cta}</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Cancellation and payment security note */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center mt-8 text-sm text-muted-foreground"
                  >
                    ნებისმიერ დროს გაუქმდება. ანგარიშსწორება დაცულია.
                  </motion.div>
                </TabsContent>
                <TabsContent value="business">
                  <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight">ბიზნეს გადაწყვეტები</h3>
                    <p className="max-w-[600px] text-muted-foreground md:text-lg">
                      მიიღეთ მორგებული ფასები და ფუნქციები თქვენი ორგანიზაციის საჭიროებების შესაბამისად. ჩვენი ბიზნეს
                      გეგმები მოიცავს გაძლიერებულ უსაფრთხოებას, გუნდის მართვას და პრიორიტეტულ მხარდაჭერას.
                    </p>
                    დაგვიკავშირდით:{" "}
                    <Link href="mailto:support@mypen.ge" className="text-primary hover:underline text-lg font-medium">
                      support@mypen.ge
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                მიიღეთ დამატებით ინფორმაცია
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">ხშირად დასმული კითხვები</h2>
              <p className="max-w-[65ch] text-muted-foreground md:text-lg mx-auto">
                აქ იპოვით პასუხებს ყველაზე ხშირად დასმულ კითხვებზე.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "რა არის Mypen.ge?",
                    answer:
                      "Mypen.ge არის მოწინავე ჩათ-პლატფორმა, რომელიც გაძლევთ საშუალებას, ერთიან ინტერფეისში იმუშაოთ მრავალფეროვან მოდელებთან. ის შექმნილია მძლავრი, მოქნილი და რეალურ დროში მუშაობის გამოცდილებისთვის, ისეთი ფუნქციებით, როგორიცაა ფაილების ატვირთვა, კოდის წერა და სტატიების მომზადება.",
                  },
                  {
                    question: "როგორ დავიწყო და არსებობს თუ არა უფასო ვერსია?",
                    answer:
                      'დაწყება მარტივია. შეგიძლიათ დარეგისტრირდეთ უფასო ანგარიშზე, რომ პლატფორმის ძირითადი ფუნქციები აღმოაჩინოთ. უფასო პაკეტი მოიცავს ტოკენების ყოველდღიურ ლიმიტს და წვდომას ისეთ AI მოდელებზე, როგორიცაა "Mypen LIGHT". ეს საუკეთესო გზაა, რომ სერვისი ყოველგვარი ვალდებულების გარეშე გამოსცადოთ.',
                  },
                  {
                    question: "რომელ AI მოდელებზე მაქვს წვდომა პლატფორმაზე?",
                    answer:
                      'პლატფორმაზე ინტეგრირებულ Mypen-ის მოდელებზე წვდომა, (როგორიცაა "Mypen LIGHT", "Mypen PRO", "Mypen ULTRA"), დამოკიდებულია თქვენს სააბონენტო პაკეტზე. Pro ან Ultra პაკეტზე გადასვლა გაგიხსნით წვდომას ჩვენს ყველაზე მძლავრ და დიდი შესაძლებლობების მქონე მოდელებზე.',
                  },
                  {
                    question: "როგორ მუშაობს ტოკენებისა და გამოწერის სისტემა?",
                    answer:
                      "ჩვენი პლატფორმა ორმაგ სისტემას იყენებს. უფასო პაკეტი გთავაზობთ ტოკენების ყოველდღიურ ლიმიტს, რომელიც ყოველ 24 საათში ახლდება. ჩვენი ფასიანი PRO და ULTRA პაკეტები კი გაძლევთ ყოველთვიურ და შეუზღუდავ ტოკენებს, რომელიც თქვენი ინდივიდუალური გამოწერის თარიღიდან ყოველ 30 დღეში განახლდება. თქვენ შეგიძლიათ თვალი ადევნოთ დეტალურ გამოყენებასა და დარჩენილ ტოკენებს თქვენი ანგარიშის პარამეტრებში.",
                  },
                  {
                    question: "შემიძლია ფაილების ატვირთვა? რა ტიპის ფაილების მხარდაჭერაა?",
                    answer:
                      'დიახ, შეგიძლიათ ატვირთოთ სხვადასხვა ფაილი, მათ შორის სურათები და ტექსტური დოკუმენტები. ინტერფეისი გამარტივებულია და გთავაზობთ "სურათის ატვირთვის" და "ტექსტად ატვირთვის" ოფციებს. ეს ფაილები უსაფრთხოდ მუშავდება და შეგიძლიათ გამოიყენოთ კონტექსტად თქვენს საუბრებში, რაც AI-ს საშუალებას აძლევს, გააანალიზოს, შეაჯამოს ან უპასუხოს კითხვებს მათი შინაარსის შესახებ.',
                  },
                  {
                    question: "რამდენად დაცულია ჩემი საუბრები და მონაცემები?",
                    answer:
                      "უსაფრთხოება ჩვენი მთავარი პრიორიტეტია. თქვენი ანგარიშის დასაცავად ვიყენებთ ავთენტიფიკაციის მყარ მეთოდებს Passport.js-ითა და JWT ტოკენებით. მონაცემთა გადაცემის ყველა არხი დაცულია, ხოლო მოწყვლადობების თავიდან ასაცილებლად ვიყენებთ შეყვანის მკაცრ ვალიდაციასა და სანიტიზაციას. თქვენი პირადი მონაცემები და საუბრები უსაფრთხოდაა შენახული.",
                  },
                  {
                    question: "ჩათის გამოცდილება რეალურ დროშია, თუ სრული პასუხის ლოდინი მიწევს?",
                    answer:
                      "ჩათის გამოცდილება შექმნილია, რომ იყოს სწრაფი და უწყვეტი. ჩვენ ვიყენებთ Server-Sent Events (SSE) ტექნოლოგიას, რომ AI-ს პასუხები გენერირებისთანავე გადმოგცეთ სტრიმინგით. ეს ნიშნავს, რომ ტექსტს ხედავთ ნაწილ-ნაწილ რეალურ დროში, რაც უზრუნველყოფს სწრაფ და ბუნებრივ საუბარს ხანგრძლივი ლოდინის გარეშე.",
                  },
                  {
                    question: "შემიძლია საკუთარი AI ასისტენტების შექმნა?",
                    answer:
                      "დიახ, Mypen.ge-ს აქვს საკუთარი AI ასისტენტებისა და აგენტების კონფიგურაციის მხარდაჭერა. ეს მძლავრი ფუნქცია გაძლევთ საშუალებას, შექმნათ და მართოთ სპეციალიზებული AI პერსონაჟები, რომლებიც მორგებული იქნება თქვენს კონკრეტულ სამუშაო პროცესებსა და ამოცანებზე, რაც პლატფორმას უაღრესად მოქნილსა და პერსონალიზებულს ხდის.",
                  },
                  {
                    question: "როგორ მუშაობს გადახდის სისტემა გამოწერისთვის?",
                    answer:
                      "გამოწერების უსაფრთხო მართვისთვის ვიყენებთ Flitt-ის გადახდის სისტემას. შეგიძლიათ თქვენი ანგარიში Pro ან Ultra პაკეტზე გადაიყვანოთ სტანდარტული გადახდის მეთოდებით. სისტემა ავტომატურად ამუშავებს განმეორებით ყოველთვიურ გადახდებს.",
                  },
                  {
                    question: "შემიძლია ჩემი ჩათების ისტორიაზე წვდომა სხვადასხვა მოწყობილობიდან?",
                    answer:
                      "რა თქმა უნდა. თქვენი ყველა საუბარი დაკავშირებულია თქვენს ანგარიშთან და უსაფრთხოდ ინახება ჩვენს მონაცემთა ბაზაში. შეგიძლიათ შეხვიდეთ ნებისმიერი მოწყობილობიდან - კომპიუტერი, პლანშეტი თუ მობილური - და უწყვეტად განაგრძოთ საუბარი ან გადახედოთ ისტორიას ზუსტად იმ ადგილიდან, სადაც გაჩერდით.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
      </main>
      <Footer />
    </div>
  )
}
