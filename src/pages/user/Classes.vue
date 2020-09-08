<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("general.classes") }}
        <v-spacer />
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer />
        <v-btn color="primary" @click="modal = true">{{ $t("classes.add_new_class.text") }}</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="classes"
        :loading="$store.state.classes.loading"
        :search="search"
        hide-default-footer
        :items-per-page="classes.length"
      >
        <template v-slot:item.action="{ item }">
          <v-btn icon class="mr-5" :to="{ name: 'class', params: { id: item.id } }">
            <v-icon>
              mdi-eye
            </v-icon>
          </v-btn>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon class="mr-3" v-on="on" @click="$toast.warning($t('general.nyi'))">
                mdi-pencil
              </v-icon>
            </template>
            <span>{{ $t("general.edit") }}</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon class="mr-3" v-on="on" @click="$toast.warning($t('general.nyi'))">
                mdi-delete
              </v-icon>
            </template>
            <span>{{ $t("general.delete") }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <modal
      v-model="modal"
      v-if="modal"
      :accept="$t('general.create')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="createClass"
    >
      <v-card-title>{{ $t("classes.add_new_class.text") }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="name"
          :rules="[$form.fieldRequired]"
          :label="$t('classes.add_new_class.name.label')"
          required
        />
        <v-datetime-picker v-model="datetime" :label="$t('classes.add_new_class.datetime.label')" />
      </v-card-text>
    </modal>
  </v-container>
</template>

<script>
import Modal from "@/components/modal/Modal";
import VDatetimePicker from "@/components/Vuetify/VDatetimePicker";
import { CREATE_CLASS } from "@/store/modules/classes";
import i18n from "@/languages";

export default {
  components: { VDatetimePicker, Modal },
  data: function() {
    return {
      modal: false,
      search: "",
      name: "",
      datetime: ""
    };
  },
  computed: {
    classes() {
      return this.$store.state.classes.classes.map(c => {
        const dt = this.$util.dateTime(c.datetime);
        return Object.assign(c, {
          date: dt.toFormat("dd-LL-yyyy HH:mm"),
          day: dt.toFormat("EEEE")
        });
      });
    },
    headers() {
      return [
        {
          text: i18n.t("classes.headers.name"),
          value: "name"
        },
        {
          text: i18n.t("classes.headers.day"),
          value: "day"
        },
        {
          text: i18n.t("classes.headers.date"),
          value: "date"
        },
        {
          value: "action",
          align: "right"
        }
      ];
    }
  },
  methods: {
    clearData() {
      this.name = "";
      this.datetime = "";
    },
    createClass() {
      this.$store.dispatch(CREATE_CLASS, { name: this.name, datetime: this.datetime }).then(() => {
        this.$toast.success(i18n.t("classes.created"));
        this.clearData();
      });
    }
  }
};
</script>
