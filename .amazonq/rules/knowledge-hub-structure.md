# Knowledge Hub Structure Rules

## Content Organization

### Navigation Structure
```
Home → Blog → Case Studies → Tutorials → Resources → Projects → About
```

### Content Sections
- **Blog** (`/blog/`): Technical articles and insights
- **Case Studies** (`/case-studies/`): In-depth project analysis with metrics
- **Tutorials** (`/tutorials/`): Step-by-step guides and how-tos
- **Resources** (`/resources/`): Tools, libraries, templates, and curated lists

### URL Structure
- Blog posts: `/blog/post-title/`
- Case studies: `/case-studies/project-name/`
- Resources: `/resources/resource-name/`
- Tutorials: `/tutorials/tutorial-name/`

## Content Creation Rules

### Front-matter Requirements

#### Blog Posts
```yaml
title: "Descriptive Title"
categories: [Primary Category, Secondary Category]
tags: [Specific, Technical, Tags]
excerpt: "SEO-friendly description"
cover: /images/posts/post-cover.jpg
featured: true/false
permalink: /blog/post-slug/
seo_title: "SEO Optimized Title"
seo_description: "Meta description"
```

#### Case Studies
```yaml
type: case-study
client: "Client Name"
project_duration: "Duration"
technologies: ["Tech1", "Tech2"]
metrics:
  - name: "Metric Name"
    before: "Before Value"
    after: "After Value"
    improvement: "Percentage"
```

#### Resources
```yaml
type: resource
resource_type: "Tool/Library/Template/Guide"
difficulty: "Beginner/Intermediate/Advanced"
last_updated: "Date"
```

### Content Standards
- All posts must have cover images
- Excerpts should be 140-160 characters for SEO
- Use proper heading hierarchy (H1 → H2 → H3)
- Include code examples where relevant
- Add "Resources" section at the end of tutorials
- Case studies must include metrics and technical details

### Image Organization
```
source/images/
├── posts/           # Blog post covers and content images
├── case-studies/    # Case study visuals and diagrams
├── resources/       # Resource screenshots and icons
└── tutorials/       # Tutorial step-by-step images
```

## SEO Requirements
- Every post needs `seo_title` and `seo_description`
- Use relevant keywords in tags
- Include structured data for case studies
- Optimize images with alt text
- Internal linking between related content

## Content Creation Commands
```bash
# Blog post
hexo new post "Title"

# Case study
hexo new case-study "Project Name Case Study"

# Resource
hexo new resource "Tool Name Review"
```

## Quality Standards
- Minimum 800 words for tutorials
- Include working code examples
- Provide external links to documentation
- Update resource posts when tools change
- Case studies must show real metrics and results