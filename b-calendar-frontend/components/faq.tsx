"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslations } from 'next-intl'

export default function FAQ() {
  const t = useTranslations('faq')

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('title')}</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {t('subtitle')}
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-3xl space-y-4 py-12">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">{t('questions.businessTypes.question')}</AccordionTrigger>
              <AccordionContent>
                {t('questions.businessTypes.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">{t('questions.executorRole.question')}</AccordionTrigger>
              <AccordionContent>
                {t('questions.executorRole.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">{t('questions.integration.question')}</AccordionTrigger>
              <AccordionContent>
                {t('questions.integration.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">{t('questions.mobileApp.question')}</AccordionTrigger>
              <AccordionContent>
                {t('questions.mobileApp.answer')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">{t('questions.security.question')}</AccordionTrigger>
              <AccordionContent>
                {t('questions.security.answer')}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
