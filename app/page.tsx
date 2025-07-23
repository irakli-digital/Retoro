"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, ArrowRight, Star, Zap, BarChart, Globe, Brain, Languages, LifeBuoy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AnnouncementBanner from "@/components/announcement-banner"

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
      title: "Mypen.ge შენს ყოველდღიურ ცხოვრებაში",
      description:
        "ბიზნეს დოკუმენტები, კრეატიული წერა, ყოველდღიური მიმოწერა — ჩვენი AI ინსტრუმენტი დაგეხმარება შექმნა დახვეწილი და ზუსტი ტექსტები საუკეთესო შედეგებისთვის.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "დოკუმენტებისა და სურათების დამუშავება",
      description:
        "ატვირთეთ დოკუმენტები და სურათები, რათა მყისიერად გააანალიზოთ, შეაჯამოთ ან ამოიღოთ მთავარი ინფორმაცია.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "ძიება ინტერნეტში რეალურ დროში",
      description: "იყავით მუდამ საქმის კურსში ვებში რეალურ დროში ძიებით და მოთხოვნისამებრ გადამოწმებული ინფორმაციით.",
      icon: <Globe className="size-5" />,
    },
    {
      title: "მულტი-მოდელის სიმძლავრე",
      description: "აირჩიეთ 3 უახლეს AI მოდელს შორის, რომლებიც ოპტიმიზებულია კრეატიულობის, სიზუსტის და სისწრაფისთვის.",
      icon: <Brain className="size-5" />,
    },
    {
      title: "ქართულზე მორგებული AI",
      description: "დაამყარეთ ბუნებრივი კომუნიკაცია AI-სთან, რომელსაც ესმის და თავისუფლად გპასუხობთ ქართულად.",
      icon: <Languages className="size-5" />,
    },
    {
      title: "24/7 მხარდაჭერა",
      description: "მიიღეთ დახმარება ნებისმიერ დროს ჩვენი ერთგული მხარდაჭერის გუნდისგან.",
      icon: <LifeBuoy className="size-5" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <AnnouncementBanner />
      <Header />
      <main className="flex-1 relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-[#171717] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                AI წერა სტრესის გარეშე
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {"Mypen 2.0 - ᲓᲐᲖᲝᲒᲔ ᲓᲠᲝ. ᲬᲔᲠᲔ ᲣᲙᲔᲗᲔᲡᲐᲓ"}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {
                  "დაივიწყე წერის სირთულეები, ენობრივი ბარიერები და გრამატიკული შეცდომები. MyPen-ი შენი პირადი დამხმარეა, რომელიც ტექსტებთან მუშაობას სასიამოვნოს ხდის."
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full h-12 px-8 text-base" asChild>
                  <Link href="https://chat.mypen.ge">
                    დაიწყე უფასოდ
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                🇬🇪 პირველად – სრული ქართული ენის მხარდაჭერით!
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-5xl"
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
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        {/* Logos Section */}

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-0">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                მახასიათებლები
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                ყველაფერი, რაც თქვენს პროდუქტიულობას ახალ საფეხურზე აიყვანს
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                ჩვენი AI პლატფორმა გაძლევთ ყველა ინსტრუმენტს, რათა ქართულად დაამყაროთ კომუნიკაცია, გამოიკვლიოთ და
                შექმნათ ისე, როგორც არასდროს.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 py-[50px] pb-24"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                როგორ მუშაობს
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">მარტივი პროცესი, უფრო ჭკვიანი AI</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                დაიწყეთ წუთებში და ნახეთ, რა მარტივად შეგიძლიათ საუბარი, ძიება და შექმნა.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: "01",
                  title: "შექმენით უფასო ანგარიში",
                  description: "დარეგისტრირდით მყისიერად თქვენი იმეილით. საკრედიტო ბარათი არ არის საჭირო.",
                },
                {
                  step: "02",
                  title: "ატვირთეთ ფაილი ან დაიწყეთ საუბარი",
                  description:
                    "ატვირთეთ დოკუმენტები ან სურათები, ან უბრალოდ დასვით კითხვები ქართულად ან ნებისმიერ ენაზე.",
                },
                {
                  step: "03",
                  title: "ისარგებლეთ AI-ის შესაძლებლობები",
                  description:
                    "მოიძიეთ ინტერნეტში ლაივ რეჟიმში, გამოიყენეთ მოწინავე მოდელები და მიიღეთ უფრო ჭკვიანი, სწრაფი შედეგები.",
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
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                10,000+ კამყოფილი მომხმარებელი
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">გამოხმაურებები</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                შეუერთდი Mypen-ის კმაყოფილი მომხმარებლების რიცხვს
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "Mypen-ის გამოყენებამდე, ჩემი პროექტებისთვის რამდენიმე სხვადასხვა AI ხელსაწყოს შორის მიწევდა გადართვა. ახლა კი ყველაფერი ერთ, მძლავრ პლატფორმაზეა თავმოყრილი. როგორც დეველოპერი, გაოცებული ვარ Mypen-ის მოქნილობით. სამი მოდელის არსებობა მაძლევს საშუალებას, ნებისმიერ ამოცანას ზუსტად მოვარგო საჭირო ინსტრუმენტი, რისი გაკეთებაც აქამდე, ამდენი დაბრკოლების გარეშე, უბრალოდ შეუძლებელი იყო.",
                  author: "გიორგი ვ.",
                  role: "პროგრამული უზრუნველყოფის ინჟინერი",
                  rating: 5,
                },
                {
                  quote:
                    "ჩვენი გუნდისთვის Mypen-ი ყოველდღიური სამუშაოს შეუცვლელი ნაწილი გახდა. ვიყენებთ ყველაფრისთვის — კლიენტების იმეილების შედგენიდან დაწყებული, შიდა დოკუმენტაციის მომზადებით დამთავრებული. PRO პაკეტი სრულიად აკმაყოფილებს ჩვენს მოთხოვნებს და ზოგავს უამრავ დროს.",
                  author: "ნინო ე.",
                  role: "მცირე ბიზნესის მფლობელი",
                  rating: 5,
                },
                {
                  quote:
                    "Mypen ULTRA არის ჩემი საიდუმლო იარაღი. როგორც კონტენტის შემქმნელი, მუდმივად მჭირდება ახალი იდეები და კვლევა. ULTRA მოდელის შეუზღუდავი წვდომა მაძლევს საშუალებას, საათობით ვიმუშაო შეფერხების გარეშე და მივიღო უმაღლესი ხარისხის პასუხები. ფაქტობრივად, ჩემი კრეატიული პარტნიორია.",
                  author: "დავით ჩ.",
                  role: "მარკეტერი და ბლოგერი",
                  rating: 5,
                },
                {
                  quote:
                    "Mypen LIGHT იდეალურია ჩემთვის. უფასო ვერსია სრულად მყოფნის ყოველდღიური დავალებებისთვის, რეფერატების დასაწერად და რთული თემების გასამარტივებლად. ძალიან მოსახერხებელი და სწრაფია. სტუდენტებისთვის ნამდვილი აღმოჩენაა!",
                  author: "ანა გ.",
                  role: "უნივერსიტეტის სტუდენტი",
                  rating: 5,
                },
                {
                  quote:
                    "PRO პაკეტზე გადასვლა საუკეთესო გადაყვეტილება იყო. ყოველთვიური ტოკენების ლიმიტი საკმაოდ დიდია და Mypen PRO მოდელი შესამჩნევად უფრო ძლიერი და ჭკვიანია. ფასი კი სრულიად მისაღებია იმ ღირებულებასთან შედარებით, რასაც ვიღებ.",
                  author: "ლევან ს.",
                  role: "ფრილანსერი",
                  rating: 5,
                },
                {
                  quote:
                    "თავიდან სკეპტიკურად ვიყავი განწყობილი, მაგრამ Mypen-მა მოლოდინს გადააჭარბა. ინტერფეისი ძალიან მარტივი და სასიამოვნოა, პასუხები კი - გასაოცრად ზუსტი და ადამიანური. ყოველდღიურ ცხოვრებაშიც კი მეხმარება, იქნება ეს რეცეპტის პოვნა თუ მოგზაურობის დაგეგმვა.",
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
                            <Star key={j} className="size-4 text-yellow-500 fill-yellow-500" />
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
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                მარტივი, გამჭვირვალე ფასები
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                თქვენს საჭიროებებზე მორგებული AI პაკეტები
              </h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
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
                          { text: "წვდომა MyPen Light მოდელზე", included: true },
                          { text: "AI წერა და თარგმნა ქართულად", included: true },
                          { text: "მცირე ფაილების დამატება (PDF, DOC, სურათები)", included: true },
                          { text: "20000 ტოკენი დღეში", included: true },
                          { text: "წვდომა MyPen Pro და Ultra მოდელებზე", included: false },
                          { text: "დოკუმენტების სიღრმისეული ანალიზი (PDF, DOCX)", included: false },
                          { text: "ინტერნეტში ძიება რეალურ დროში", included: false },
                        ],
                        cta: "დაიწყე უფასოდ",
                      },
                      {
                        name: "MyPen Pro",
                        price: "₾24",
                        description: "მაღალი ხარისხის კონტენტის სწრაფად შესაქმნელად.",
                        features: [
                          { text: "წვდომა MyPen Pro და Light მოდელებზე", included: true },
                          { text: "AI წერა და თარგმნა ქართულად", included: true },
                          { text: "დიდი ფაილების ანალიზი (PDF, DOC, სურათები)", included: true },
                          { text: "250000 ტოკენი თვეში", included: true },
                          { text: "წვდომა MyPen Ultra მოდელზე", included: false },
                          { text: "ინტერნეტში ძიება რეალურ დროში", included: false },
                        ],
                        cta: "დაიწყე უფასოდ",
                        popular: true,
                      },
                      {
                        name: "MyPen Ultra",
                        price: "₾52", // Keep original price for Enterprise as it's not specified in the new request
                        description: "შეუზღუდავი შემოქმედებისა და რთული ამოცანებისთვის.",
                        features: [
                          { text: "წვდომა MyPen Ultra მოდელზე", included: true },
                          { text: "AI წერა და თარგმნა ქართულად", included: true },
                          { text: "უძლიერესი მოდელი ყველა რთული ამოცანისთვის", included: true },
                          { text: "ინტერნეტში ძიება რეალურ დროში", included: true },
                          { text: "დიდი ფაილების ანალიზი (PDF, DOC, სურათები)", included: true },
                          { text: "შეუზღუვი ტოკენები", included: true },
                        ],
                        cta: "დაიწყე უფასოდ",
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
                              Most Popular
                            </div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4">
                              <span className="text-4xl font-bold">{plan.price}</span>
                              {plan.price !== "უფასო" && <span className="text-muted-foreground ml-1">/თვე</span>}
                            </div>
                            <p className="text-muted-foreground mt-2">{plan.description}</p>
                            <ul className="space-y-3 my-6 flex-grow">
                              {plan.features.map((feature, j) => (
                                <li key={j} className="flex items-center">
                                  <span className="flex items-center justify-center w-4 h-4 mr-2">
                                    {feature.included ? (
                                      <Check className="text-primary" />
                                    ) : (
                                      <X className="text-destructive" />
                                    )}
                                  </span>
                                  <span>{feature.text}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`}
                              variant={plan.popular ? "default" : "outline"}
                              asChild
                            >
                              {plan.cta === "დაიწყე უფასოდ" ? (
                                <Link href="https://chat.mypen.ge">{plan.cta}</Link>
                              ) : (
                                <Link href="#">{plan.cta}</Link>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
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
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                მიიღეთ დამატებით ინფორმაცია
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">ხშირად დასმული კითხვები</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
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
