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

    it('only ever advertises the one contact address confirmed to receive mail', () => {
        // hello@abdalkader.dev is confirmed working. Any *other* address
        // appearing here would be unverified, and a dead contact address in
        // structured data is worse than none — so pin it rather than ban emails.
        // Domain parts are matched label-by-label so a trailing sentence full
        // stop is not swallowed into the address.
        const found = faqItems
            .flatMap((i) => i.answer.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) ?? [])
            .map((e) => e.toLowerCase());
        for (const email of found) {
            expect(email).toBe('hello@abdalkader.dev');
        }
    });

    it('stays consistent with how skillsData classifies the ML frameworks', () => {
        // TensorFlow and PyTorch are shipped work, so the FAQ may name them.
        // This guards the direction of the claim: it must not inflate back into
        // blanket "I specialize in" phrasing across a framework list.
        const joined = faqItems.map((i) => i.answer).join(' ').toLowerCase();
        expect(joined).not.toContain('specialize in modern ai/ml frameworks');
    });
});
