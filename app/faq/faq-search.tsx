"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";
import type { FAQ } from "@/lib/types";

interface FAQSearchProps {
  faqs: FAQ[];
}

export default function FAQSearch({ faqs }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    
    const query = searchQuery.toLowerCase();
    return faqs.filter(faq => 
      faq.question_ka.toLowerCase().includes(query) ||
      faq.answer_ka.toLowerCase().includes(query) ||
      (faq.category_ka && faq.category_ka.toLowerCase().includes(query))
    );
  }, [faqs, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Field */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="მოძებნეთ კითხვები..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base bg-card border-2 border-border focus:border-primary"
        />
      </div>

      {/* Results */}
      {filteredFAQs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? 'ვერ მოიძებნა შესაბამისი კითხვები.' : 'ჯერ არ არის ხშირად დასმული კითხვები.'}
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {filteredFAQs.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={`faq-${faq.id}`}
              className="border border-border rounded-lg bg-card px-4 py-2"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex items-start justify-between w-full pr-4">
                  <span className="text-foreground font-medium">{faq.question_ka}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: faq.answer_ka }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Results count */}
      {searchQuery && (
        <div className="text-center text-sm text-muted-foreground">
          მოიძებნა {filteredFAQs.length} შედეგი
        </div>
      )}
    </div>
  );
}