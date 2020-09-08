<template>
  <v-container class="py-0">
    <v-row>
      <v-col col="12" md="6" lg="4" xl="3">
        <change-password />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ChangePassword from "../../components/auth/ChangePassword";
export default {
  components: {
    ChangePassword
  }
};
</script>
