<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("general.people") }}
        <v-spacer />
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer />
        <v-btn color="primary" @click="modal = true">{{ $t("people.add_new_person.text") }}</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="$store.state.people.people"
        :loading="$store.state.people.loading"
        :search="search"
        hide-default-footer
        :items-per-page="$store.state.people.people.length"
      >
        <template v-slot:item.action>
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
      @agree="createPerson"
    >
      <v-card-title>{{ $t("people.add_new_person.text") }}</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="first_name"
          :rules="[$form.fieldRequired]"
          :label="$t('people.add_new_person.first_name.label')"
          required
        />
        <v-text-field
          v-model="last_name"
          :rules="[$form.fieldRequired]"
          :label="$t('people.add_new_person.last_name.label')"
          required
        />
        <v-text-field
          v-model="email"
          :rules="[$form.fieldRequired]"
          :label="$t('people.add_new_person.email.label')"
          required
        />
        <v-text-field v-model="student_number" :label="$t('people.add_new_person.student_number.label')" />
      </v-card-text>
    </modal>
  </v-container>
</template>

<script>
import Modal from "@/components/modal/Modal";
import i18n from "@/languages";
import { PEOPLE, CREATE_PERSON } from "@/store/modules/people";

export default {
  components: { Modal },
  data: function() {
    return {
      modal: false,
      search: "",
      first_name: "",
      last_name: "",
      email: "",
      student_number: ""
    };
  },
  created() {
    this.$store.dispatch(PEOPLE);
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
          text: i18n.t("people.headers.full_name"),
          value: "full_name"
        },
        {
          text: i18n.t("people.headers.email"),
          value: "email"
        },
        {
          text: i18n.t("people.headers.student_number"),
          value: "student_number"
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
      this.first_name = "";
      this.last_name = "";
      this.email = "";
      this.student_number = "";
    },
    createPerson() {
      this.$store
        .dispatch(CREATE_PERSON, {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          student_number: this.student_number
        })
        .then(() => {
          this.$toast.success(i18n.t("people.created"));
          this.clearData();
        });
    }
  }
};
</script>
