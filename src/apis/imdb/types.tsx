export interface RootObject {
    actorList: ActorList[];
    awards: string;
    boxOffice: BoxOffice;
    companies: string;
    companyList: CompanyList[];
    contentRating: string;
    countries: string;
    countryList: CountryList[];
    directorList: CompanyList[];
    directors: string;
    errorMessage?: any;
    fullCast: FullCast;
    fullTitle: string;
    genreList: CountryList[];
    genres: string;
    id: string;
    imDbRating: string;
    imDbRatingVotes: string;
    image: string;
    images?: any;
    keywordList: string[];
    keywords: string;
    languageList: CountryList[];
    languages: string;
    metacriticRating: string;
    originalTitle: string;
    plot: string;
    plotLocal: string;
    plotLocalIsRtl: boolean;
    posters?: any;
    ratings: Ratings;
    releaseDate: string;
    runtimeMins: string;
    runtimeStr: string;
    similars: Similar[];
    starList: CompanyList[];
    stars: string;
    tagline?: any;
    title: string;
    trailer: Trailer;
    tvEpisodeInfo?: any;
    tvSeriesInfo?: any;
    type: string;
    wikipedia: Wikipedia;
    writerList: CompanyList[];
    writers: string;
    year: string;
}

export interface Wikipedia {
    errorMessage: string;
    fullTitle: string;
    imDbId: string;
    language: string;
    plotFull: PlotFull;
    plotShort: PlotFull;
    title: string;
    titleInLanguage: string;
    type: string;
    url: string;
    year: string;
}

export interface PlotFull {
    html: string;
    plainText: string;
}

export interface Trailer {
    errorMessage: string;
    fullTitle: string;
    imDbId: string;
    link: string;
    linkEmbed: string;
    thumbnailUrl: string;
    title: string;
    type: string;
    uploadDate?: any;
    videoDescription: string;
    videoId: string;
    videoTitle: string;
    year: string;
}

export interface Similar {
    id: string;
    imDbRating: string;
    image: string;
    title: string;
}

export interface Ratings {
    errorMessage: string;
    filmAffinity: string;
    fullTitle: string;
    imDb: string;
    imDbId: string;
    metacritic: string;
    rottenTomatoes: string;
    theMovieDb: string;
    title: string;
    type: string;
    year: string;
}

export interface FullCast {
    actors: ActorList[];
    directors: Directors;
    errorMessage: string;
    fullTitle: string;
    imDbId: string;
    others: Directors[];
    title: string;
    type: string;
    writers: Directors;
    year: string;
}

export interface Directors {
    items: Item[];
    job: string;
}

export interface Item {
    description: string;
    id: string;
    name: string;
}

export interface CountryList {
    key: string;
    value: string;
}

export interface CompanyList {
    id: string;
    name: string;
}

export interface BoxOffice {
    budget: string;
    cumulativeWorldwideGross: string;
    grossUSA: string;
    openingWeekendUSA: string;
}

export interface ActorList {
    asCharacter: string;
    id: string;
    image: string;
    name: string;
}
