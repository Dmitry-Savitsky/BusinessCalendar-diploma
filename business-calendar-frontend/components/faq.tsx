import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQ() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Find answers to common questions about B-Calendar
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What types of businesses can use B-Calendar?</AccordionTrigger>
              <AccordionContent>
                B-Calendar is designed for any service-based business that requires appointment scheduling. This
                includes cleaning services, wedding photographers, hairdressers, consultants, and many more.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does the executor role work?</AccordionTrigger>
              <AccordionContent>
                Executors are the service providers who perform the actual services. Companies can add executors to
                their account, assign services to them, and manage their schedules. Executors can log in to view their
                assigned orders, services, and client information.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I integrate B-Calendar with my website?</AccordionTrigger>
              <AccordionContent>
                Yes, B-Calendar provides a booking widget that you can embed on your website. This allows your clients
                to book services directly from your website without having to navigate to a separate platform.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
              <AccordionContent>
                Currently, B-Calendar is a web-based application optimized for both desktop and mobile browsers. A
                dedicated mobile app is on our roadmap for future development.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>How secure is my data?</AccordionTrigger>
              <AccordionContent>
                We take security seriously. All data is encrypted in transit and at rest. We implement role-based access
                control to ensure that only authorized users can access specific information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
