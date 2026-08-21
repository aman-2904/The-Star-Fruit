# Website Routes Documentation

This document explains all the different pages (routes) on the website. It is designed to help anyone understand how the website is structured and where each web address (URL) leads.

---

## 🏠 Main Website (Public Pages)
These are the pages that any visitor to the website can see.

| URL Path | What it is |
|---|---|
| **`/`** | **Home Page** - The main landing page of the website. |
| **`/login`** | **Login Page** - Where regular users log in to their accounts. |
| **`/auth`** | **Authentication Page** - Handles login/signup processes. |
| **`/profile`** | **User Profile** - Where a logged-in user can view and edit their details. |
| **`/thankyou`** | **Thank You Page** - A success page shown after completing an action (like an enquiry or booking). |

---

## 🛏️ Properties & Stays
Pages related to viewing and booking properties.

| URL Path | What it is |
|---|---|
| **`/stays`** | **All Stays** - A list or search page showing all available properties. |
| **`/stays/[id]`** | **Property Details** - A specific property's page (e.g., `/stays/123` shows details for property 123). |

---

## 📝 Blog
Pages for reading articles and news.

| URL Path | What it is |
|---|---|
| **`/blogs`** | **Blog Home** - A list of all published blog articles. |
| **`/blogs/[slug]`** | **Single Article** - A specific blog post (e.g., `/blogs/top-10-destinations`). |

---

## 💬 Messaging
Pages for user communication.

| URL Path | What it is |
|---|---|
| **`/messages`** | **User Inbox** - Where a regular user can see their messages and conversations. |

---

## 🔑 Host Portal
Pages dedicated to property owners (hosts) who list their properties on the website.

| URL Path | What it is |
|---|---|
| **`/host`** | **Host Landing** - The main introductory page for hosts. |
| **`/host/onboarding`** | **Host Onboarding** - The step-by-step setup process for new hosts. |
| **`/host/dashboard`** | **Host Dashboard** - The main control panel for hosts to see their overall stats. |
| **`/host/dashboard/[id]`** | **Specific Property Dashboard** - Stats and controls for one specific property a host owns. |
| **`/host/listings`** | **Host Listings** - Where a host manages all the properties they have listed. |
| **`/host/messages`** | **Host Messages** - Where hosts communicate with guests or admin. |
| **`/host/enquiries`** | **Host Enquiries** - Where hosts see booking requests or questions about their properties. |

---

## ⚙️ Super Admin Portal
The central control panel for the website owners/administrators to manage everything.

| URL Path | What it is |
|---|---|
| **`/admin`** | **Admin Home** - The main entry point for administrators. |
| **`/admin/login`** | **Admin Login** - Secure login page for administrators. |
| **`/admin/signup`** | **Admin Signup** - Page to create new administrator accounts. |
| **`/admin/dashboard`** | **Admin Dashboard** - The main overview of website statistics and activity. |
| **`/admin/users`** | **Manage Users** - Where admins can view, edit, or remove user accounts. |
| **`/admin/listings`** | **Manage Properties** - Where admins can review and approve all properties on the site. |
| **`/admin/messages`** | **Admin Messages** - Where admins handle system messages or support chats. |
| **`/admin/enquiries`** | **General Enquiries** - Where admins view general questions submitted through the site. |
| **`/admin/property-enquiries`** | **Property Enquiries** - Where admins view specific questions about properties. |
| **`/admin/settings`** | **Website Settings** - Global configuration for the website. |
| **`/admin/activity-logs`** | **Activity Logs** - A record of actions taken on the platform for security and tracking. |

---

## ✍️ Blog Admin Portal
A separate area specifically for writers or editors to manage blog content.

| URL Path | What it is |
|---|---|
| **`/blogadmin/login`** | **Blog Admin Login** - Login page for blog managers. |
| **`/blogadmin/signup`** | **Blog Admin Signup** - Signup page for blog managers. |
| **`/blogadmin/dashboard`** | **Blog Dashboard** - Overview of all blog posts and their status. |
| **`/blogadmin/dashboard/create-blog`** | **Write New Post** - The editor page to write and publish a new article. |
| **`/blogadmin/dashboard/edit/[id]`** | **Edit Post** - The editor to modify an existing article. |
| **`/blogadmin/dashboard/preview/[id]`** | **Preview Post** - See how an article will look before it goes live. |

---

## 🤖 System & Background URLs (For Tech/SEO)
These are behind-the-scenes addresses used by search engines (like Google) or integrations.

| URL Path | What it is |
|---|---|
| **`/api/...`** | **Application Programming Interfaces** - Background data channels (e.g., settings, Facebook pixel tracking). |
| **`/sitemap.xml`** | **Main Website Map** - Tells Google how to find pages. |
| **`/sitemap-properties.xml`** | **Properties Map** - Tells Google about all the property pages. |
| **`/sitemap-blogs.xml`** | **Blogs Map** - Tells Google about all the blog pages. |
| **`/sitemap-pages.xml`** | **Static Pages Map** - Tells Google about standard pages (like Home, About, etc.). |

---
*Note: URLs containing bracketed words like `[id]` or `[slug]` mean that part of the link is dynamic. For example, `[id]` will be replaced by a real property number in the actual web browser (like `/stays/402`).*
