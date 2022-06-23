export interface RootObject {
  brand_store: Brandstore;
  compare_with_similar: Comparewithsimilar[];
  frequently_bought_together: Frequentlyboughttogether;
  newer_model: Comparewithsimilar;
  product: Product2;
  request_info: Requestinfo;
  request_metadata: Requestmetadata;
  request_parameters: Requestparameters;
  sponsored_products: Sponsoredproduct[];
}

export interface Sponsoredproduct {
  asin: string;
  image: string;
  is_prime: boolean;
  link: string;
  price: Price;
  rating: number;
  ratings_total: number;
  title: string;
}

export interface Requestparameters {
  amazon_domain: string;
  gtin: string;
  type: string;
}

export interface Requestmetadata {
  amazon_url: string;
  created_at: string;
  processed_at: string;
  total_time_taken: number;
}

export interface Requestinfo {
  credits_remaining: number;
  credits_used: number;
  credits_used_this_request: number;
  success: boolean;
}

export interface Product2 {
  a_plus_content: Apluscontent;
  amazons_choice: Amazonschoice;
  asin: string;
  attributes: Attribute[];
  bestsellers_rank: Bestsellersrank[];
  bestsellers_rank_flat: string;
  brand: string;
  buybox_winner: Buyboxwinner;
  categories: Category[];
  description: string;
  dimensions: string;
  feature_bullets: string[];
  feature_bullets_count: number;
  feature_bullets_flat: string;
  first_available: Firstavailable;
  images: Image[];
  images_count: number;
  important_information: Importantinformation;
  is_bundle: boolean;
  keywords: string;
  keywords_list: string[];
  link: string;
  main_image: Mainimage;
  manufacturer: string;
  material: string;
  model_number: string;
  more_buying_choices: Morebuyingchoice[];
  parent_asin: string;
  protection_plans: Protectionplan[];
  rating: number;
  rating_breakdown: Ratingbreakdown;
  ratings_total: number;
  reviews_total: number;
  search_alias: Searchalias;
  sell_on_amazon: boolean;
  specifications: Attribute[];
  specifications_flat: string;
  sub_title: Subtitle;
  title: string;
  top_reviews: Topreview[];
  variant_asins_flat: string;
  variants: Variant[];
  videos: Video2[];
  videos_count: number;
}

export interface Video2 {
  duration_seconds: number;
  group_id: string;
  group_type: string;
  height: number;
  is_hero_video: boolean;
  link: string;
  thumbnail: string;
  title: string;
  variant: string;
  width: number;
}

export interface Variant {
  asin: string;
  dimensions: Attribute[];
  images: Image[];
  is_current_product: boolean;
  link: string;
  main_image: string;
  price: Price;
  title: string;
}

export interface Topreview {
  body: string;
  body_html: string;
  date: Firstavailable;
  helpful_votes: number;
  id: string;
  images?: Mainimage[];
  is_global_review: boolean;
  link?: string;
  profile: Profile;
  rating: number;
  review_country: string;
  title: string;
  verified_purchase: boolean;
  vine_program: boolean;
  videos?: Video[];
  vine_program_free_product?: boolean;
}

export interface Video {
  image: string;
  video: string;
}

export interface Profile {
  id?: string;
  link?: string;
  name: string;
  image?: string;
}

export interface Subtitle {
  link: string;
  text: string;
}

export interface Searchalias {
  title: string;
  value: string;
}

export interface Ratingbreakdown {
  five_star: Fivestar;
  four_star: Fivestar;
  one_star: Fivestar;
  three_star: Fivestar;
  two_star: Fivestar;
}

export interface Fivestar {
  count: number;
  percentage: number;
}

export interface Protectionplan {
  asin: string;
  price: Price;
  title: string;
}

export interface Morebuyingchoice {
  free_shipping: boolean;
  position: number;
  price: Price;
  seller_name: string;
}

export interface Mainimage {
  link: string;
}

export interface Importantinformation {
  sections: Section[];
}

export interface Section {
  body: string;
  title: string;
}

export interface Image {
  link: string;
  variant: string;
}

export interface Firstavailable {
  raw: string;
  utc: string;
}

export interface Category {
  name: string;
  category_id?: string;
  link?: string;
}

export interface Buyboxwinner {
  availability: Availability;
  condition: Condition;
  fulfillment: Fulfillment;
  is_amazon_fresh: boolean;
  is_prime: boolean;
  new_offers_count: number;
  new_offers_from: Price;
  offer_id: string;
  price: Price;
  rrp: Price;
  shipping: Shipping;
}

export interface Shipping {
  raw: string;
}

export interface Fulfillment {
  is_fulfilled_by_amazon: boolean;
  is_fulfilled_by_third_party: boolean;
  is_sold_by_amazon: boolean;
  is_sold_by_third_party: boolean;
  standard_delivery: Standarddelivery;
  third_party_seller: Thirdpartyseller;
  type: string;
}

export interface Thirdpartyseller {
  id: string;
  link: string;
  name: string;
}

export interface Standarddelivery {
  date: string;
  name: string;
}

export interface Condition {
  is_new: boolean;
}

export interface Availability {
  dispatch_days: number;
  raw: string;
  stock_level: number;
  type: string;
}

export interface Bestsellersrank {
  category: string;
  link: string;
  rank: number;
}

export interface Attribute {
  name: string;
  value: string;
}

export interface Amazonschoice {
  keywords: string;
}

export interface Apluscontent {
  has_a_plus_content: boolean;
  has_brand_story: boolean;
  third_party: boolean;
}

export interface Frequentlyboughttogether {
  products: Product[];
  total_price: Price;
}

export interface Product {
  asin: string;
  image: string;
  link: string;
  title: string;
  price?: Price;
}

export interface Comparewithsimilar {
  asin: string;
  image: string;
  link: string;
  price: Price;
  rating: number;
  ratings_total: number;
  title: string;
}

export interface Price {
  currency: string;
  raw: string;
  symbol: string;
  value: number;
}

export interface Brandstore {
  id: string;
  link: string;
}

