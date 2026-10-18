export interface Reviewer {
  slug: string;           // URL slug, e.g. "marcin-dudek"
  name: string;
  site: string;           // full URL
  specialty: string;      // short tag, e.g. "WordPress Plugins"
  background: string;     // 1-2 sentence bio
  whatHeChecks: string[]; // array of things they review
  pricing: {
    tiers: Array<{
      label: string;      // e.g. "Quick Scan"
      price: string;      // e.g. "$99"
      description: string;
    }>;
  };
  turnaround: string;
  featured: boolean;
  ctaLabel: string;       // e.g. "Book a Review"
  ctaUrl: string;
}

export const reviewers: Reviewer[] = [
  {
    slug: "marcin-dudek",
    name: "Marcin Dudek",
    site: "https://marcindudek.dev/services/wp-plugin-review",
    specialty: "WordPress Plugins",
    background: "15 years of WordPress development. Former CTO at CreativeMinds where he built and maintained 50+ plugins. Toptal top 3%.",
    whatHeChecks: [
      "SQL injection",
      "Nonce verification",
      "Capability checks",
      "Output escaping",
      "Sanitization",
      "File system safety",
      "REST endpoint protection",
      "Third-party library CVEs"
    ],
    pricing: {
      tiers: [
        {
          label: "Quick Scan",
          price: "$99",
          description: "Up to 500 lines, 48-hour turnaround"
        },
        {
          label: "Full Review",
          price: "$250",
          description: "Up to 10,000 lines, 5 business days"
        }
      ]
    },
    turnaround: "48 hours to 5 business days",
    featured: true,
    ctaLabel: "Book a Review",
    ctaUrl: "https://marcindudek.dev/services/wp-plugin-review"
  }
];
