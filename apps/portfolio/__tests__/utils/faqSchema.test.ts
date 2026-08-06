import { faqItems } from '@/data/faqData';
import { faqPageJsonLd } from '@/utils/jsonld';

/**
 * Google's FAQPage guidelines require every declared question and answer to be
 * visible on the page that declares it. The site previously emitted FAQPage
 * schema for five questions that appeared nowhere on it.
 *
 * Both the schema and the visible FAQSection now render from `faqItems`, so
 * these tests exist to keep that single source intact — if someone hardcodes
 * questions back into either consumer, this fails.
 */
describe('FAQ schema matches the rendered source', () => {
    const schema = faqPageJsonLd() as {
        '@type': string;
        mainEntity: Array<{
            '@type': string;
            name: string;
            acceptedAnswer: { '@type': string; text: string };
        }>;
    };

    it('declares a FAQPage', () => {
        expect(schema['@type']).toBe('FAQPage');
    });

    it('declares exactly the questions in faqData, in order', () => {
        expect(schema.mainEntity.map((q) => q.name)).toEqual(faqItems.map((i) => i.question));
    });

    it('declares exactly the answers in faqData, verbatim', () => {
        expect(schema.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(
            faqItems.map((i) => i.answer)
        );
    });

    it('uses the correct schema.org types throughout', () => {
        for (const entry of schema.mainEntity) {
            expect(entry['@type']).toBe('Question');
            expect(entry.acceptedAnswer['@type']).toBe('Answer');
        }
    });

    it('has no empty question or answer', () => {
        for (const item of faqItems) {
            expect(item.question.trim().length).toBeGreaterThan(0);
            expect(item.answer.trim().length).toBeGreaterThan(0);
        }
    });

    it('claims no email address that has not been verified to receive mail', () => {
        // The previous copy directed people to hello@abdalkader.dev, which was
        // never confirmed. A dead contact address in schema is worse than none,
        // so the answers route to the contact form instead.
        const joined = faqItems.map((i) => i.answer).join(' ');
        expect(joined).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    });

    it('does not claim specialisation in tooling classified as studied-only', () => {
        // The skills data classifies TensorFlow and PyTorch as `studied`, not
        // `shipped`. The FAQ must not contradict that.
        const joined = faqItems.map((i) => i.answer).join(' ').toLowerCase();
        expect(joined).not.toContain('specialize in modern ai/ml frameworks');
        expect(joined).not.toContain('pytorch');
    });
});
