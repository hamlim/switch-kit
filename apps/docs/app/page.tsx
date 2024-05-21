import { Code } from "bright";
import { StarIcon } from "lucide-react";
import type { Metadata } from "next";
import { Blockquote, H1, H2, InlineCode, Link, P, UnorderedList } from "~/components/typography";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const metadata: Metadata = {
  title: "Switch Kit",
  description: "A \"build-your-own\" Feature Flagging/Toggling/Experimentation/etc system!",
  authors: [{
    name: "Matt Hamlin",
    url: "https://matthamlin.me",
  }],
};

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  lightSelector: "html.light",
  darkSelector: "html.dark",
};

let sectionClasses =
  "py-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14 max-w-[75ch] mx-auto min-h-[40vh] flex flex-col justify-center";

export default function Home() {
  return (
    <main>
      <header className={sectionClasses}>
        <H1>Switch Kit</H1>
        <P>
          Switch Kit is a	&#8220;build-your-own&#8221; Feature Flagging/Toggling/Experimentation/etc system!
        </P>

        <div className="pt-10 flex row justify-evenly items-center">
          <Button asChild>
            <a href="#installation">Get Started</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/hamlim/switch-kit">
              <StarIcon className="mr-2 inline-flex" /> Star on GitHub
            </a>
          </Button>
        </div>
      </header>
      <section id="installation" className={sectionClasses}>
        <H2>Installation</H2>
        <P>
          Install <InlineCode>switch-kit</InlineCode> via your favorite package manager:
        </P>
        <div className="mt-6">
          <Tabs defaultValue="bun">
            <TabsList>
              <TabsTrigger value="bun">Bun</TabsTrigger>
              <TabsTrigger value="yarn">Yarn</TabsTrigger>
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              <TabsTrigger value="npm">npm</TabsTrigger>
            </TabsList>
            <div className="my-10">
              <TabsContent value="bun">
                <Code lang="shell">
                  bun install switch-kit
                </Code>
              </TabsContent>
              <TabsContent value="yarn">
                <Code lang="shell">
                  yarn add switch-kit
                </Code>
              </TabsContent>
              <TabsContent value="pnpm">
                <Code lang="shell">
                  pnpm install switch-kit
                </Code>
              </TabsContent>
              <TabsContent value="npm">
                <Code lang="shell">
                  npm install switch-kit
                </Code>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <P>
          You'll also most likely want to install one of the pre-built <InlineCode>Storage Adaptors</InlineCode>:
        </P>
        <UnorderedList>
          <li>
            <InlineCode>@switch-kit/cloudflare-kv-adaptor</InlineCode>
          </li>
        </UnorderedList>
        <P>
          Want to use a different KV (or database) solution? Open a{" "}
          <Link href="https://github.com/hamlim/switch-kit/discussions/new/choose">Discussion</Link>{" "}
          on the repo to request other adaptors!
        </P>
      </section>
      <section className={sectionClasses}>
        <H2 className="mt-4">Usage:</H2>
        <Code lang="tsx">
          {`// Create the SwitchKit client
let switchKit = new SwitchKit({
  // This example is using the CloudflareKVAdaptor
  // However you can change this out for anything
  // that implements the StorageAdaptor interface from \`@switch-kit/storage-interface\`
  adaptor: new CloudflareKVAdaptor({
    namespace: "my-switches",
    authToken: process.env.CLOUDFLARE_AUTH_TOKEN,
    accountID: process.env.CLOUDFLARE_ACCOUNT_ID,
  }),
});

// Initialize the SwitchKit client
await switchKit.init();

// Returns either a Switch or undefined
let switchA = await switchKit.get("switch-a");

if (switchA?.value === "on") {
  // do something
}`}
        </Code>
      </section>
      {
        /* <section className={sectionClasses}>
        <H2>Configuration:</H2>
        <P>
          <InlineCode>one-version</InlineCode>{" "}
          can work out of the box without any configuration at all, however if you&apos;d like to allow specific
          workspaces to use different versions of a dependency, you&apos;ll need to add a configuration file.
        </P>
        <P>
          <InlineCode>one-version</InlineCode> currently supports the following package managers:
        </P>
        <UnorderedList>
          <li>
            <InlineCode>bun</InlineCode>
          </li>
          <li>
            <InlineCode>pnpm</InlineCode>
          </li>
          <li>
            <InlineCode>npm</InlineCode> - Greater than version 7.x
          </li>
          <li>
            <InlineCode>yarn-classic</InlineCode> - Yarn version 1.x
          </li>
          <li>
            <InlineCode>yarn-berry</InlineCode> - Yarn version 2.x, 3.x, 4.x
          </li>
        </UnorderedList>
        <P>
          You can configure <InlineCode>one-version</InlineCode> via either a{" "}
          <InlineCode>one-version.config.jsonc</InlineCode> or <InlineCode>one-version.config.json</InlineCode>{" "}
          file. An example configuration is provided below:
        </P>

        <Code lang="json">
          {`{
  "$schema": "https://one-version.vercel.app/schema.json",
  // one of: "bun", "yarn-berry", "yarn-classic", "pnpm", "npm"
  // by default it will try to detect the package manager based on the presence of a lockfile
  "packageManager": "bun",
  // A mapping of dependencies, and which workspaces are "allowed" to use different versions
  "overrides": {
    "react": {
      "18.0.0": ["pkg-a"],
      // Wildcards are supported, and will capture any workspaces!
      "17.0.0": ["*"]
    }
  },
  // one of: "pin", "loose", defaults to "loose" if not provided
  // pin: all dependencies and devDependencies must use an exact version
  // meaning no ranges (\`^\`, \`~\`, \`.x\`, etc.) are allowed
  "versionStrategy": "pin"
}`}
        </Code>
      </section>
      <section className={sectionClasses}>
        <H2>Background and Inspiration:</H2>
        <P>
          This package is a spiritual fork of the{" "}
          <Link href="https://github.com/wayfair/one-version">
            <InlineCode>@wayfair/one-version</InlineCode>
          </Link>{" "}
          package which I had contributed to while at Wayfair.
        </P>
        <P>
          That package still works fine, but hasn&apos;t been maintained in some time - and also doesn&apos;t support
          either <InlineCode>bun</InlineCode> or <InlineCode>npm</InlineCode>.
        </P>
        <P>
          Both this package and the original implement a version of Google&apos;s{" "}
          <InlineCode>One-Version Rule</InlineCode>:
        </P>
        <Blockquote>
          <P>
            For every dependency in [a] repository, there must be only one version of that dependency to choose<sup>
              <Link href="#fn-1">1</Link>
            </sup>
          </P>
        </Blockquote>
        <P id="fn-1">
          [1] - <Link href="https://abseil.io/resources/swe_at_google.2.pdf">Software Engineering At Google</Link>{" "}
          - Winters, Manshreck and Wright, 2020, p. 341
        </P>
      </section> */
      }
      <footer className={sectionClasses}>
        <P>
          The source code for the library is available on{" "}
          <Link href="https://github.com/hamlim/switch-kit">GitHub</Link>. If you run into any bugs, please report them
          via <Link href="https://github.com/hamlim/switch-kit/issues/new">issues</Link>.
        </P>
        <P>
          If you&apos;d like to discuss changes to the project, feel free to start a{" "}
          <Link href="https://github.com/hamlim/switch-kit/discussions/new/choose">discussion</Link>!
        </P>
      </footer>
    </main>
  );
}
