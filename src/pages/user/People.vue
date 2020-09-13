<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("general.people") }}
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('general.search')"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer />
        <v-btn color="primary" @click="modal = true">{{ $t("people.add_new_person.text") }}</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="$store.state.people.people"
        :loading="$store.state.people.loading"
        :search="search"
      >
        <template v-slot:item.action="{ item }">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon class="mr-3" v-on="on" @click="setEditPerson(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>{{ $t("general.edit") }}</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon class="mr-3" v-on="on" @click="setDeletePerson(item)">
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
      :accept="edit ? $t('general.save_changes') : $t('general.create')"
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
    <modal
      v-model="deleteModal"
      :title="$t('people.delete_person.title')"
      :text="$t('people.delete_person.text')"
      :accept="$t('general.delete')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="deletePerson"
    ></modal>
  </v-container>
</template>

<script>
import Modal from "@/components/modal/Modal";
import { PEOPLE, CREATE_PERSON, EDIT_PERSON, DELETE_PERSON } from "@/store/modules/people";
import i18n from "@/languages";

export default {
  components: { Modal },
  data: function() {
    return {
      modal: false,
      edit: false,
      search: "",
      id: null,
      first_name: "",
      last_name: "",
      email: "",
      student_number: "",
      deleteModal: false
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
      this.edit = false;
      this.id = null;
      this.first_name = "";
      this.last_name = "";
      this.email = "";
      this.student_number = "";
    },
    setEditPerson(person) {
      this.edit = true;
      this.modal = true;
      this.id = person.id;
      this.first_name = person.first_name;
      this.last_name = person.last_name;
      this.email = person.email;
      this.student_number = person.student_number;
    },
    createPerson() {
      if (this.edit) {
        this.$store
          .dispatch(EDIT_PERSON, {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            student_number: this.student_number
          })
          .then(() => {
            this.$toast.success(i18n.t("people.updated"));
            this.clearData();
          });
      } else {
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
    },
    setDeletePerson(person) {
      this.deleteModal = true;
      this.id = person.id;
    },
    deletePerson() {
      this.$store.dispatch(DELETE_PERSON, { id: this.id }).then(() => {
        this.$toast.success(i18n.t("people.deleted"));
        this.clearData();
      });
    }
  }
};
</script>
