
export const titleSearch = (title: string) => `https://imdb-api.com/en/API/SearchMovie/k_1s9gjbo0/${title}`;

export const ttIdSearch = (ttId: string) => `https://imdb-api.com/en/API/Title/k_1s9gjbo0/${ttId}/FullActor,FullCast,Trailer,Ratings,Wikipedia,`;

export function processTitleResults(title: string) {
    const outcome: any = titleSearch(title);
    return outcome.results[0].id;
}

const fetched = fetch(processTitleResults('Speed'));
console.log(fetched);
fetched.then(f => {
    console.log(f);
    console.log((f as any).toString());
})