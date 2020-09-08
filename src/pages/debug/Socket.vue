<template>
  <v-container>
    <v-form @submit.prevent="sendMessage" :value="!!message">
      <v-row align="start" justify="center">
        <v-col cols="12" class="text-center">
          <h2>{{ $t("socket.title") }}</h2>
        </v-col>
        <v-col cols="12" class="text-center">
          <h3>
            {{ $t("socket.connected") }}
            <v-icon v-if="$socket.connected" small color="success">
              mdi-check-circle
            </v-icon>
            <v-icon v-else small color="error">mdi-close-circle</v-icon>
          </h3>
        </v-col>
        <v-col cols="12" md="6" xl="4" class="text-center">
          <v-text-field
            v-model="message"
            :label="$t('socket.echo')"
            outlined
            prepend-inner-icon="mdi-cloud-upload"
            hide-details
          />
          <v-row justify="space-between">
            <v-col class="text-left">
              <v-btn v-if="!$socket.connected" color="info" class="my-3" @click="connect">
                {{ $t("socket.connect") }}
              </v-btn>
              <v-btn v-else color="info" class="my-3" @click="disconnect">
                {{ $t("socket.disconnect") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="primary" class="my-3" :disabled="!message || !$socket.connected" type="submit">
                {{ $t("socket.send") }}
              </v-btn>
            </v-col>
            <v-col class="text-right">
              <v-btn text outlined @click="reset" class="my-3">
                {{ $t("socket.reset") }}
              </v-btn>
            </v-col>
          </v-row>
          <div class="mb-2">
            <h4>
              {{ $t("socket.sent") }}
              <v-icon v-if="echoSent" small color="success">mdi-check-circle</v-icon>
              <v-icon v-else small color="error">mdi-close-circle</v-icon>
            </h4>
            <h4>
              {{ $t("socket.received") }}
              <v-icon v-if="echoReceived" small color="success">mdi-check-circle</v-icon>
              <v-icon v-else small color="error">mdi-close-circle</v-icon>
            </h4>
          </div>
          <h3>{{ $t("socket.messages") }}</h3>
          <div v-for="(message, index) in echoMessages" :key="index">
            {{ message }}
          </div>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      echoSent: false,
      echoReceived: false,
      echoMessages: []
    };
  },
  sockets: {
    echo(message) {
      this.echoMessages.push(message);
      this.echoReceived = true;
    }
  },
  methods: {
    connect() {
      this.$socket.client.open();
    },
    disconnect() {
      this.$socket.client.close();
    },
    sendMessage() {
      this.echoSent = true;
      this.echoReceived = false;
      this.$socket.client.emit("echo", this.message);
      this.message = "";
    },
    reset() {
      this.disconnect();
      this.message = "";
      this.echoReceived = false;
      this.echoSent = false;
      this.echoMessages = [];
    }
  },
  beforeDestroy() {
    this.disconnect();
  }
};
</script>
