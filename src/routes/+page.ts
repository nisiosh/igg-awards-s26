import { redirect } from "@sveltejs/kit";
import order from "$lib/ballots/ballots.json" with { "type": "json" };
import type { LoadEvent } from "@sveltejs/kit";

function stripExtension(fileName: string) {
    return fileName.replace(/\.json$/, '');
}

export function load({ url }: LoadEvent) {
    if (url.pathname === '/') {
        redirect(307, `/vote/${stripExtension(order[0])}`);
    }
}