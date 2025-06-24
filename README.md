EXPLANATION OF WHERE EVERYTHING IS FOR MR JAQUES:

THE APP FOLDER

- contains all actual pages associated with the site
- the (auth) section contains the authentication module, it is bracketed so the URL dosent contain auth
- each folder within it is its own page
- the protected section can only be accessed by authenticated users, and contains all the main pages of the site
- it has its own layout.tsx, which defines some styling and layout for individual sections
- main landing page is in page.tsx at the root of app

THE COMPONENTS FOLDER

- components are small chunks of pages that include basic HTML features, along with slightly more complex pages for abstraction
- the auth section contains mostly full pages that are abstracted out, these have mainly been pulled and altered from the supabase auth library
- the catalogue section contains a bunch of custom components I have made for the catalogue section, allows me to use them multiple times in different places across the site
- the UI section is a radix + shadcn folder of basic UI components
- providers, sidebar, etc are theme and styling components for the site

THE DATA FOLDER

- self explanatory, contains the data locally on the server. Includes movie data json pulled from an API, onboarding movies preset abstracted

THE HOOKS FOLDER

- contains reusable functions and other abstracted functions to increase readability and simplicity of the main pages
- most of these include lots of supabase (database) calls

THE LIB FOLDER

- contains my schemas, which define Zod validation (input validation) schemas and also basic interface/type schemas
- also contains other misc functions such as my fetch-movies API call

THE UTILS/SUPABASE FOLDER

- I am using a supabase database, so these sections define basic hooks that can be used to create clients with supabase and access data

MIDDLEWARE

- a mediator every time a page is loaded, performs some checks to ensure user is validated, etc

THE API FOLDER

- this contains my python model API for the recommendations. Currently this can only be hosted locally, hopefully will host on Vercel

THE PUBLIC FOLDER

- contains necessary data for public calls, such as movies, basic site images, etc

SUPABASE

- I am making use of an external database called Supabase. It allows me to create a bunch of tables with data, and create API calls to read this data
- most of the security happens on the suapabase server side. This includes RLS policies which only restrict database access to certain users with particular IDs or validation. Supabase also does a lot of input validation itself, and has inbuild prevention of injection breaches, etc.
- I am also using a private bucket to store user profile images, prevents me having to store them locally

OTHER NOTES

- I am using a NextJS framework built on react, so my pages are designed in that layout, with function at the top and returning an HTML page. I mostly use state variables, which allow the user to update them.\
- A lot of the security is abstracted/difficult to find, I promise its there and I can explain how it all works if needed
- To run this site locally you need to install Bun (NPM alternative), and NodeJS (and maybe some other stuff but I think its mainly those two). Then type bun i to install all dependencies, and bun run dev to launch a development server. If you have any difficulties I can bring my laptop and run it, but hopefully I will have it hosted by Thursday.
- The site is hosted on https://movie-matcher-black.vercel.app/ it uses a pythonanyhwere hosted api, which is a little slow but works. If something breaks, you might want to just use the local host version (might have to reconfigure the fetch link but probably not).
