"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, ArrowRight, Star, Languages, LifeBuoy, Users, FileText, Search, Briefcase, GraduationCap, MessageSquare, Code, Plane, Wallet, Shield, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"

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
      icon: <Languages className="size-6 stroke-[1.5] text-blue-500" />,
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      title: "ვებ-ძიება რეალურ დროში",
      description: "პასუხები წყაროებითა და სწრაფი fact-check-ით.",
      icon: <Search className="size-6 stroke-[1.5] text-purple-500" />,
      iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    },
    {
      title: "ფაილების ღრმა ანალიზი",
      description: "დიდი PDFs/დოკები → შეჯამება, ცხრილები, ინსაითები.",
      icon: <FileText className="size-6 stroke-[1.5] text-amber-500" />,
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      title: "მრავალმოდელა არჩევანი",
      description: "Light/Pro/Ultra სიჩქარისა და სიღრმისთვის.",
      icon: <Layers className="size-6 stroke-[1.5] text-emerald-500" />,
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      title: "კონფიდენციალურობა",
      description: "ფაილების/ჩათების წაშლა და კონტროლი შენს ხელშია.",
      icon: <Shield className="size-6 stroke-[1.5] text-rose-500" />,
      iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    },
    {
      title: "24/7 მხარდაჭერა",
      description: "მზად ვართ, როცა დაგჭირდება.",
      icon: <LifeBuoy className="size-6 stroke-[1.5] text-cyan-500" />,
      iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />

      {/* Sticky mobile CTA */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-50">
        <Button
          size="lg"
          className="w-full rounded-full h-12 px-6 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80"
          asChild
        >
          <Link
            href="https://chat.mypen.ge"
            aria-label="დაიწყე უფასოდ"
            data-cta-id="cta_mobile_sticky"
          >
            დაიწყე უფასოდ
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      <main className="flex-1 relative pb-20 sm:pb-0">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#171717] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

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
                შენი ქართული წერის AI ასისტენტი
              </h1>

              {/* Social Proof Chip */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <Badge className="rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2" variant="secondary">
                  <Users className="size-4" />
                  10,000+ კმაყოფილი მომხმარებელი
                </Badge>
              </div>

              <p className="text-base md:text-lg text-muted-foreground mb-5 max-w-[70ch] mx-auto leading-relaxed">
                მიიღე პასუხები ნებისმიერ თემაზე, წერე გამართული ქართულით, ატვირთე და გააანალიზე ფაილები — ერთ სივრცეში.
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <Badge className="rounded-full px-3 py-1 text-xs font-medium" variant="outline">
                  ქართული ენა - 100%
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

              {/* CTAs with analytics ids */}
              <div className="flex flex-col items-center gap-2 pt-4">
                <Button
                  size="lg"
                  className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
                  asChild
                >
                  <Link
                    href="https://chat.mypen.ge"
                    aria-label="დაიწყე უფასოდ"
                    data-cta-id="cta_hero_start_free"
                  >
                    დაიწყე უფასოდ
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <span className="text-xs text-muted-foreground">საკრედიტო ბარათი არ არის საჭირო</span>
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
                  alt="MyPen dashboard interface with AI assistant"
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10" />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70" />
              <div className="absolute -top-6 -left-6 -z-10 h-[250px] w-[250px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70" />
            </motion.div>
          </div>
        </section>

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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">რატომ MyPen</h2>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-4"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item} className="flex flex-col items-center text-center">
                  <div className={`size-14 rounded-full ${feature.iconBg} flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[30ch]">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Use Cases Section - რას აკეთებს */}
        <section id="use-cases" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

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

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto mb-8">
              {[
                {
                  title: "სამუშაოს მოძებნა",
                  description: "CV/cover letter, ვაკანსიები, გასაუბრებისთვის მზადება.",
                  icon: <Briefcase className="size-5 stroke-[1.5] text-indigo-500" />,
                  iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
                },
                {
                  title: "ფაილების ანალიზი",
                  description: "დიდი PDFs/დოკები → შეჯამება და მთავარი ინსაითები.",
                  icon: <FileText className="size-5 stroke-[1.5] text-amber-500" />,
                  iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
                },
                {
                  title: "სწავლა & კვლევა",
                  description: "რთული თემების ახსნა + წყაროები.",
                  icon: <GraduationCap className="size-5 stroke-[1.5] text-emerald-500" />,
                  iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
                },
                {
                  title: "ყოველდღიური კითხვები",
                  description: "რეცეპტები, რჩევები, \"როგორ გავაკეთო?\".",
                  icon: <MessageSquare className="size-5 stroke-[1.5] text-purple-500" />,
                  iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
                },
                {
                  title: "ბიზნეს დოკუმენტები",
                  description: "ბრეიფები, შეთავაზებები, მონახაზები (იურ. კონსულტაცია არაა).",
                  icon: <Briefcase className="size-5 stroke-[1.5] text-blue-500" />,
                  iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
                },
                {
                  title: "კოდირება",
                  description: "ახსნა, დებაგი, მოკლე სკრიპტები.",
                  icon: <Code className="size-5 stroke-[1.5] text-slate-500" />,
                  iconBg: "bg-slate-500/10 dark:bg-slate-500/20",
                },
                {
                  title: "მოგზაურობა",
                  description: "მარშრუტი, ბიუჯეტი, ლოკალური გაიდები.",
                  icon: <Plane className="size-5 stroke-[1.5] text-sky-500" />,
                  iconBg: "bg-sky-500/10 dark:bg-sky-500/20",
                },
                {
                  title: "ფინანსები",
                  description: "გეგმები, ჩექლისტები, ხარჯების ორგანიზება.",
                  icon: <Wallet className="size-5 stroke-[1.5] text-green-500" />,
                  iconBg: "bg-green-500/10 dark:bg-green-500/20",
                },
              ].map((useCase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                >
                  <Link
                    href="https://chat.mypen.ge"
                    className="block h-full"
                    aria-label={`${useCase.title} – დაიწყე უფასოდ`}
                    data-cta-id="cta_usecase_card"
                    data-usecase={useCase.title}
                  >
                    <Card className="h-full overflow-hidden border-border/40 bg-background/50 backdrop-blur transition-all hover:shadow-md hover:border-primary/50 group cursor-pointer">
                      <CardContent className="p-5">
                        <div className={`size-10 rounded-full ${useCase.iconBg} flex items-center justify-center mb-3`}>
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
              className="flex justify-center pt-2"
            >
              <Button
                size="lg"
                className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
                asChild
              >
                <Link href="https://chat.mypen.ge" aria-label="დაიწყე უფასოდ" data-cta-id="cta_usecases_section">
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

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative mb-10">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />

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
              className="flex justify-center pt-2"
            >
              <Button
                size="lg"
                className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg"
                asChild
              >
                <Link href="https://chat.mypen.ge" aria-label="დაიწყე უფასოდ" data-cta-id="cta_how_it_works">
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
                  quote: "სამი მოდელი ერთ პლატფორმაზე — მოქნილი და მარტივი გამოყენება.",
                  author: "გიორგი ვ.",
                  role: "პროგრამული უზრუნველყოფის ინჟინერი",
                  rating: 5,
                },
                {
                  quote: "PRO პაკეტი ჩვენს გუნდს პირდაპირ დროს უზოგავს.",
                  author: "ნინო ე.",
                  role: "მცირე ბიზნესის მფლობელი",
                  rating: 5,
                },
                {
                  quote: "ULTRA მოდელი — ჩემი საიდუმლო იარაღი კვლევისთვის.",
                  author: "დავით ჩ.",
                  role: "მარკეტერი და ბლოგერი",
                  rating: 5,
                },
                {
                  quote: "უფასო ვერსია მყოფნის ყოველდღიური დავალებებისთვის.",
                  author: "ანა გ.",
                  role: "უნივერსიტეტის სტუდენტი",
                  rating: 5,
                },
                {
                  quote: "Pro ძლიერი და სწრაფია — ფასი სამართლიანია.",
                  author: "ლევან ს.",
                  role: "ფრილანსერი",
                  rating: 5,
                },
                {
                  quote: "პასუხები ბუნებრივია და ზუსტი ქართულად.",
                  author: "მარიამ რ.",
                  role: "პროექტის მენეჯერი",
                  rating: 5,
                },
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex mb-4">
                        {Array(t.rating).fill(0).map((_, j) => (
                          <Star key={j} className="size-4 text-yellow-500" />
                        ))}
                      </div>
                      <p className="mb-6 flex-grow text-sm">{t.quote}</p>
                      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">
                          {t.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{t.author}</p>
                          <p className="text-sm text-muted-foreground">{t.role}</p>
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
              <Button size="lg" className="rounded-full h-12 px-8 text-base transition-all hover:scale-105 hover:shadow-lg" asChild>
                <Link href="https://chat.mypen.ge" aria-label="დაიწყე უფასოდ" data-cta-id="cta_testimonials">
                  დაიწყე უფასოდ
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

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
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">თქვენს საჭიროებებზე მორგებული AI პაკეტები</h2>
              <p className="max-w-[70ჩ] text-muted-foreground md:text-lg mx-auto">
                მიუხედავად იმისა, ახლა იწყებთ თუ გჭირდებათ პროფესიონალური დონის AI ინსტრუმენტები — გვაქვს პაკეტი, რომელიც შეესაბამება თქვენს მოთხოვნებს.
              </p>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1">
                    <TabsTrigger value="monthly" className="rounded-full px-6">თვიურად</TabsTrigger>
                    <TabsTrigger value="business" className="rounded-full px-6">ბიზნესისთვის</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="monthly">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Mypen LIGHT",
                        price: "უფასო",
                        description: "ყველა საბაზისო ინსტრუმენტი AI-სთან მუშაობის დასაწყებად.",
                        features: [
                          "წვდომა Mypen Light მოდელზე",
                          "მოხმარების დღიური ლიმიტი",
                          "სტანდარტული სიჩქარე",
                          "იდეალურია ყოველდღიური ამოცანებისთვის",
                          "AI წერა და თარგმნა ქართულად",
                        ],
                        cta: "დაიწყე უფასოდ",
                        ctaId: "cta_pricing_starter",
                        colorScheme: "default",
                      },
                      {
                        name: "Mypen ULTRA",
                        price: "₾69",
                        description: "შეუზღუდავი შემოქმედებისა და რთული ამოცანებისთვის.",
                        features: [
                          "ყველაფერი რაც Mypen Pro-შია",
                          "Mypen Ultra მოდელზე წვდომა",
                          "∞ შეუზღუდავი წვდომა",
                          "20x მეტი კონტექსტის დამუშავება",
                          "სიღრმისეული ანალიზი და კოდის წერა",
                          "სრული წვდომა ყველა ინსტრუმენტზე (ძიება, ფაილები, თარგმანი)",
                        ],
                        cta: "აირჩიე Ultra",
                        ctaId: "cta_pricing_ultra",
                        popular: true,
                        colorScheme: "purple",
                      },
                      {
                        name: "Mypen PRO",
                        price: "₾29",
                        description: "მაღალი ხარისხის კონტენტის სწრაფად შესაქმნელად.",
                        features: [
                          "ყველაფერი რაც Mypen Light-შია",
                          "Mypen Pro მოდელზე წვდომა",
                          "10x მეტი წვდომის ლიმიტი",
                          "5x მეტი კონტექსტის დამუშავება",
                          "მაღალი სიჩქარე",
                          "კრეატიული კონტენტის შექმნა",
                          "ფაილების ანალიზი (PDF, DOC, იმიჯები)",
                          "ინტერნეტში ძიება",
                        ],
                        cta: "აირჩიე Pro",
                        ctaId: "cta_pricing_pro",
                        colorScheme: "blue",
                      },
                    ].map((plan, i) => {
                      const isBlue = plan.colorScheme === "blue"
                      const isPurple = plan.colorScheme === "purple"
                      const borderColor = isPurple ? "border-purple-500/50" : isBlue ? "border-blue-500/50" : "border-border/40"
                      const titleColor = isPurple ? "text-purple-400" : isBlue ? "text-blue-400" : ""
                      const buttonClass = isPurple
                        ? "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white border-0"
                        : isBlue
                        ? "border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        : ""

                      return (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                        <Card className={`relative overflow-hidden h-full ${borderColor} ${plan.popular ? "shadow-xl shadow-purple-500/20" : "shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}>
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-purple-600 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                              ყველაზე პოპულარული
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className={`text-2xl font-bold ${titleColor}`}>{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className={`text-4xl font-bold ${titleColor}`}>{plan.price}</span>
                              {plan.price !== "უფასო" && <span className="text-muted-foreground ml-1">/თვე</span>}
                            </div>
                            <p className="text-muted-foreground mt-2 max-w-[40ჩ]">{plan.description}</p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <Check className={`size-4 mr-2 flex-shrink-0 ${isPurple ? "text-purple-500" : isBlue ? "text-blue-500" : "text-primary"}`} />
                                  <span className="text-sm">{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Button className={`w-full mt-auto rounded-full transition-all hover:scale-105 ${buttonClass}`} variant={plan.popular ? "default" : "outline"} asChild>
                              <Link href="https://chat.mypen.ge" aria-label={plan.cta} data-cta-id={plan.ctaId}>
                                {plan.cta}
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    )}
                  </div>

                  {/* Cancellation and payment security note */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center mt-8 text-sm text-muted-foreground"
                  >
                                        გაუქმება და თანხის დაბრუნება 7 დღის განმავლობაში.
                  </motion.div>
                </TabsContent>

                <TabsContent value="business">
                  <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight">ბიზნეს გადაწყვეტები</h3>
                    <p className="max-w-[600px] text-muted-foreground md:text-lg">
                      მიიღეთ მორგებული ფასები და ფუნქციები თქვენი ორგანიზაციის საჭიროებების შესაბამისად. ბიზნეს გეგმები მოიცავს გაძლიერებულ უსაფრთხოებას, გუნდის მართვას და პრიორიტეტულ მხარდაჭერას.
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
                მიიღეთ დამატებითი ინფორმაცია
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">ხშირად დასმული კითხვები</h2>
              <p className="max-w-[65ჩ] text-muted-foreground md:text-lg mx-auto">აქ იპოვით პასუხებს ყველაზე ხშირად დასმულ კითხვებზე.</p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="multiple" defaultValue={["item-0", "item-1", "item-2"]} className="w-full">
                {[
                  {
                    question: "MyPen უბრალოდ \"მომწერინე\" ხომ არაა?",
                    answer:
                      "არა. ეს არის სრულფასოვანი ქართული AI ასისტენტი: სამუშაო, ფაილები, კვლევა და ყოველდღიური კითხვები — ერთ სივრცეში.",
                  },
                  {
                    question: "ბარათი მჭირდება დასაწყებად?",
                    answer:
                      "არა. დაიწყე უფასო პაკეტით და გადაიყვანე როცა დაგჭირდება.",
                  },
                  {
                    question: "რამდენად ზუსტია პასუხები?",
                    answer:
                      "რთულ თემებზე მოაქვთ წყაროები/ციტირებები; საჭიროებისას სწრაფი fact-check.",
                  },
                  {
                    question: "რა არის Mypen.ge?",
                    answer:
                      "Mypen.ge არის მოწინავე ჩათ-პლატფორმა მრავალ მოდელზე მუშაობისთვის — ფაილები, კოდი, სტატიები, ყველაფერი ერთ ინტერფეისში.",
                  },
                  {
                    question: "რომელ AI მოდელებზე მაქვს წვდომა?",
                    answer:
                      'წვდომა დამოკიდებულია პაკეტზე ("Mypen LIGHT", "Mypen PRO", "Mypen ULTRA").',
                  },
                  {
                    question: "როგორ მუშაობს გადახდა და გამოწერა?",
                    answer:
                      "PRO/ULTRA პაკეტები თვიური გადახდით მუშაობს Flitt-ის მეშვეობით. გაუქმება ნებისმიერ დროსაა შესაძლებელი.",
                  },
                  {
                    question: "ფაილები უსაფრთხოა?",
                    answer:
                      "ფაილები ინახება დაშიფრულად; შეგიძლია წაშალო ნებისმიერ დროს.",
                  },
                ].map((faq, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>

              {/* FAQ end small CTA */}
              <div className="flex justify-center mt-8">
                <Button variant="ghost" className="rounded-full" asChild>
                  <Link href="https://chat.mypen.ge" data-cta-id="cta_faq" aria-label="დაიწყე უფასოდ">
                    დაიწყე უფასოდ
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

