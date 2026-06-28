import { redirect } from "@sveltejs/kit";
import order from "$lib/ballots/ballots.json" with { "type": "json" };

function stripExtension(fileName: string) {
    return fileName.replace(/\.json$/, '');
}

export function load() {
    redirect(307, `/${stripExtension(order[0])}`)
}