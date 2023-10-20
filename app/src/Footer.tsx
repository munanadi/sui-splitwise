function Footer() {
  return (
    <footer className=" max-w-7xl bg-black text-white px-1 my-1 text-center w-full">
      <hr className="mx-auto border-0 border-t-2 border-white mb-1" />
      <div className="flex justify-between items-center">
        <p className="text-center text-sm leading-loose md:text-left">
          Built by{" "}
          <a
            href={"https://twitter.com/munananadi"}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            a beginner
          </a>
          . The source code is available on{" "}
          <a
            href={"https://github.com/munanadi/sui-splitwise"}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
        <h1 className="text-lg font-semibold mb-5">SuiSplit</h1>
      </div>
    </footer>
  );
}

export default Footer;
