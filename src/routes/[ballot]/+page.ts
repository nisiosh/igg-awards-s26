import order from "$lib/ballots/ballots.json" with { "type": "json" };
import type { Ballot } from "$lib/types/OptionTypes.js";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types.js";

const modules = import.meta.glob('$lib/ballots/*.json');

const byName: Record<string, () => Promise<{ default: Ballot }>> = {};
for (const path in modules) {
    byName[path.split('/').pop()!] = modules[path] as () => Promise<{ default: Ballot }>;
}

function stripExtension(fileName: string) {
    return fileName.replace(/\.json$/, '');
}

export const load: PageLoad = async ({ params }) => {
    const file = `${params.ballot}.json`;
    const ballotIndex = order.indexOf(file);
    if (ballotIndex === -1 || !byName[file]) throw error(404, "Ballot not found 😬");

    return {
        ballot: (await byName[file]()).default,
        previous: ballotIndex > 0 ? stripExtension(order[ballotIndex - 1]) : null,
        next: ballotIndex < order.length - 1 ? stripExtension(order[ballotIndex + 1]) : null,
        step: ballotIndex + 1,
        total: order.length
    };
};