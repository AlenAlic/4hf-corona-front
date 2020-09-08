<script>
/* eslint-disable no-console */
export default {
  created() {
    let installPrompt;

    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      installPrompt = e;
      // setTimeout(() => {
      //   this.sheet = true;
      // }, 1000);
    });

    this.installer = () => {
      installPrompt.prompt();
      installPrompt.userChoice.then(result => {
        if (result.outcome === "accepted") {
          console.log("Install accepted!");
        } else {
          console.log("Install denied!");
        }
      });
    };
  },
  methods: {
    installSW() {
      console.log("Install accepted!");
      this.sheet = false;
    },
    cancelSW() {
      console.log("Install cancelled!");
      this.sheet = false;
    }
  }
};
</script>
