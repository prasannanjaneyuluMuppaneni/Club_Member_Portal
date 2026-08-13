import { documents } from "./documents";

export function searchDocuments(question) {

    const words = question
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 2);

    const results = documents.map(document => {

        const text = document.text.toLowerCase();

        let score = 0;

        words.forEach(word => {

            if (text.includes(word)) {
                score++;
            }

        });

        return {
            ...document,
            score
        };
    });

    return results
        .filter(document => document.score > 0)
        .sort((a, b) => b.score - a.score);
}