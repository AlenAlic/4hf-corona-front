<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("general.couples") }}
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('general.search')"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer />
        <v-btn color="primary" @click="openModal">{{ $t("couple.add_new_couple.text") }}</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="$store.state.couples.couples"
        :loading="$store.state.couples.loading"
        :search="search"
      >
        <template v-slot:item.action="{ item }">
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon class="mr-3" v-on="on" @click="setEditCouple(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>{{ $t("general.edit") }}</span>
          </v-tooltip>
          <v-tooltip left>
            <template v-slot:activator="{ on }">
              <v-icon class="mr-3" v-on="on" @click="setDeleteCouple(item)">
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
      @agree="createCouple"
    >
      <v-card-title>{{ $t("couple.add_new_couple.text") }}</v-card-title>
      <v-card-text>
        <v-select
          v-model="lead"
          :items="filteredLeads"
          persistent-hint
          :label="$t('couple.add_new_couple.lead.label')"
          :rules="[$form.fieldRequired]"
          item-text="full_name"
          item-value="id"
          return-object
          clearable
          :loading="$store.state.people.loading"
        ></v-select>
        <v-select
          v-model="follow"
          :items="filteredFollows"
          persistent-hint
          :label="$t('couple.add_new_couple.follow.label')"
          :rules="[$form.fieldRequired]"
          item-text="full_name"
          item-value="id"
          return-object
          clearable
          :loading="$store.state.people.loading"
        ></v-select>
      </v-card-text>
    </modal>
    <modal
      v-model="deleteModal"
      :title="$t('couple.delete_couple.title')"
      :text="$t('couple.delete_couple.text')"
      :accept="$t('general.delete')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="deleteCouple"
    ></modal>
  </v-container>
</template>

<script>
import Modal from "@/components/modal/Modal";
import { COUPLES, CREATE_COUPLE, EDIT_COUPLE, DELETE_COUPLE } from "@/store/modules/couples";
import i18n from "@/languages";
import { PEOPLE } from "@/store/modules/people";

export default {
  components: { Modal },
  data: function() {
    return {
      modal: false,
      edit: false,
      search: "",
      id: null,
      lead: null,
      follow: null,
      deleteModal: false
    };
  },
  created() {
    this.$store.dispatch(COUPLES);
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
          text: i18n.t("couple.headers.lead"),
          value: "lead.full_name"
        },
        {
          text: i18n.t("couple.headers.follow"),
          value: "follow.full_name"
        },
        {
          value: "action",
          align: "right"
        }
      ];
    },
    people() {
      return this.$store.state.people.people;
    },
    filteredLeads() {
      if (!this.follow) {
        return this.people;
      } else {
        return this.people.filter(p => p.id !== this.follow.id);
      }
    },
    filteredFollows() {
      if (!this.lead) {
        return this.people;
      } else {
        return this.people.filter(p => p.id !== this.lead.id);
      }
    }
  },
  methods: {
    openModal() {
      this.modal = true;
      this.$store.dispatch(PEOPLE);
    },
    clearData() {
      this.edit = false;
      this.id = null;
      this.lead = null;
      this.follow = null;
    },
    setEditCouple(couple) {
      this.edit = true;
      this.openModal();
      this.id = couple.id;
      this.lead = couple.lead;
      this.follow = couple.follow;
    },
    createCouple() {
      if (this.edit) {
        this.$store
          .dispatch(EDIT_COUPLE, {
            id: this.id,
            lead_id: this.lead.id,
            follow_id: this.follow.id
          })
          .then(() => {
            this.$toast.success(i18n.t("couple.updated"));
            this.clearData();
          });
      } else {
        this.$store
          .dispatch(CREATE_COUPLE, {
            lead_id: this.lead.id,
            follow_id: this.follow.id
          })
          .then(() => {
            this.$toast.success(i18n.t("couple.created"));
            this.clearData();
          });
      }
    },
    setDeleteCouple(person) {
      this.deleteModal = true;
      this.id = person.id;
    },
    deleteCouple() {
      this.$store.dispatch(DELETE_COUPLE, { id: this.id }).then(() => {
        this.$toast.success(i18n.t("couple.deleted"));
        this.clearData();
      });
    }
  }
};
</script>
