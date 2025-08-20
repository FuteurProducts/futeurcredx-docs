import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ContentBlock } from "@/data/docs-data";

export interface AccordionItemProps {
  trigger: string;
  content: ContentBlock[];
}

// A recursive renderer for nested content inside the accordion
const renderContent = (blocks: ContentBlock[]) => {
  return blocks.map((block, index) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{block.text}</p>;
      case 'image':
        return <img key={index} src={block.src} alt={block.alt} className="rounded-lg my-4 shadow-md" />;
      case 'link':
          return <a key={index} href={block.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{block.text}</a>
      default:
        return null;
    }
  });
};

export const DocsAccordion = ({ items }: { items: AccordionItemProps[] }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem value={`item-${index}`} key={index} className="border-b border-gray-200 dark:border-gray-800">
          <AccordionTrigger className="text-gray-900 dark:text-white hover:no-underline font-semibold text-md">{item.trigger}</AccordionTrigger>
          <AccordionContent>
            <div className="pl-4 border-l-2 border-gray-700 ml-2 pt-4">
              {renderContent(item.content)}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
