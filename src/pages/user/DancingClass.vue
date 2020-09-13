<template>
  <v-container v-if="dancing_class">
    <v-card>
      <v-card-title>
        <span>
          {{ dancing_class.name }}
          <br />
          <span class="caption">{{ $util.dateTime(dancing_class.datetime).toFormat("dd-LL-yyyy HH:mm") }}</span>
        </span>
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('general.search')"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer />
        <div>
          <v-row class="mb-3" no-gutters justify="end">
            <v-btn color="primary" @click="openAddCoupleModal">{{ $t("classes.add_couple.text") }}</v-btn>
          </v-row>
          <v-row class="mb-5" no-gutters justify="end">
            <v-btn color="primary" @click="openModal">{{ $t("classes.add_attendee.text") }}</v-btn>
          </v-row>
          <v-row no-gutters justify="end">
            <v-btn color="secondary" @click="openCreateCoupleModal">{{ $t("classes.create_couple.text") }}</v-btn>
          </v-row>
        </div>
      </v-card-title>
      <v-tabs fixed-tabs background-color="primary" dark v-model="tabs">
        <v-tab>{{ $t("classes.attendees.text") }} ({{ attendees.length }})</v-tab>
        <v-tab>{{ $t("classes.couples") }} ({{ couples.length }})</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item>
          <v-data-table
            :headers="headers"
            :items="attendees"
            :loading="loading"
            :search="search"
            hide-default-footer
            :items-per-page="attendees.length"
          >
            <template v-slot:item.action="{ item }">
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-3" v-on="on" @click="setEditAttendee(item)">
                    mdi-pencil
                  </v-icon>
                </template>
                <span>{{ $t("general.edit") }}</span>
              </v-tooltip>
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-icon class="mr-3" v-on="on" @click="setDeleteAttendee(item)">
                    mdi-delete
                  </v-icon>
                </template>
                <span>{{ $t("general.delete") }}</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-tab-item>
        <v-tab-item>
          <v-data-table
            :headers="coupleHeaders"
            :items="couples"
            :loading="loading"
            :search="search"
            hide-default-footer
            :items-per-page="couples.length"
          >
            <template v-slot:item.action="{ item }">
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
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <modal
      v-model="addCoupleModal"
      v-if="addCoupleModal"
      :accept="$t('general.add')"
      :close="$t('general.cancel')"
      @agree="addCouple"
    >
      <v-card-title>{{ $t("classes.add_couple.text") }}</v-card-title>
      <v-card-text>
        <v-select
          v-model="couple"
          :items="filteredCouples"
          persistent-hint
          :label="$t('classes.add_couple.couple.label')"
          :rules="[$form.fieldRequired]"
          item-text="couple"
          item-value="id"
          return-object
          clearable
        ></v-select>
      </v-card-text>
    </modal>
    <modal
      v-model="deleteCoupleModal"
      :title="$t('classes.delete_couple.title')"
      :text="$t('classes.delete_couple.text')"
      :accept="$t('general.remove')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="deleteCouple"
    ></modal>
    <modal
      v-model="addAttendeeModal"
      v-if="addAttendeeModal"
      :accept="edit ? $t('general.save_changes') : $t('general.add')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="addAttendee"
    >
      <v-card-title>{{ $t("classes.add_attendee.text") }}</v-card-title>
      <v-card-text>
        <v-select
          v-model="person"
          :items="people"
          persistent-hint
          :label="$t('classes.add_attendee.person.label')"
          :disabled="$store.state.people.loading"
          :loading="$store.state.people.loading"
          :rules="[$form.fieldRequired]"
          item-text="full_name"
          item-value="id"
        ></v-select>
        <v-text-field
          v-model="notes"
          :label="$t('classes.add_attendee.notes.label')"
          persistent-hint
          :hint="$t('classes.add_attendee.notes.hint')"
          required
        />
      </v-card-text>
    </modal>
    <modal
      v-model="deleteAttendeeModal"
      :title="$t('classes.delete_attendee.title')"
      :text="$t('classes.delete_attendee.text')"
      :accept="$t('general.remove')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="deleteAttendee"
    ></modal>
    <modal
      v-model="createCoupleModal"
      v-if="createCoupleModal"
      :accept="$t('general.create')"
      :close="$t('general.cancel')"
      @agree="createCouple"
    >
      <v-card-title>{{ $t("classes.create_couple.text") }}</v-card-title>
      <v-card-text>
        <v-select
          v-model="attendee_1"
          :items="filteredAttendeesOne"
          persistent-hint
          :label="$t('classes.add_attendee.person.label')"
          :rules="[$form.fieldRequired]"
          item-text="full_name"
          item-value="id"
          return-object
          clearable
        ></v-select>
        <v-select
          v-model="attendee_2"
          :items="filteredAttendeesTwo"
          persistent-hint
          :label="$t('classes.add_attendee.person.label')"
          :rules="[$form.fieldRequired]"
          item-text="full_name"
          item-value="id"
          return-object
          clearable
        ></v-select>
      </v-card-text>
    </modal>
  </v-container>
  <loading-page v-else-if="!dancing_class && loading" />
</template>

<script>
import i18n from "@/languages";
import Modal from "@/components/modal/Modal";
import LoadingPage from "@/pages/LoadingPage";
import { PEOPLE } from "@/store/modules/people";
import {
  CLASSES_ADD_ATTENDEE,
  CLASSES_ADD_COUPLE,
  CLASSES_CREATE_COUPLE,
  CLASSES_DELETE_ATTENDEE,
  CLASSES_DELETE_COUPLE,
  CLASSES_EDIT_ATTENDEE
} from "@/store/modules/classes";
import { COUPLES } from "@/store/modules/couples";

export default {
  components: { Modal, LoadingPage },
  data: function() {
    return {
      addAttendeeModal: false,
      edit: false,
      search: "",
      dancing_class: null,
      loading: true,
      person: null,
      notes: "",
      createCoupleModal: false,
      attendee_1: null,
      attendee_2: null,
      tabs: 0,
      addCoupleModal: false,
      couple: null,
      attendee_id: 0,
      deleteAttendeeModal: false,
      dancing_class_person: null,
      deleteCoupleModal: false,
      dancing_class_couple: null
    };
  },
  created() {
    this.getData();
  },
  computed: {
    attendees() {
      return this.dancing_class ? this.dancing_class.attendees : [];
    },
    attendeeIds() {
      return this.attendees.map(a => a.person.id);
    },
    people() {
      if (this.edit) {
        const attendeeIds = this.attendeeIds.filter(a => a !== this.attendee_id);
        return this.$store.state.people.people.filter(p => !attendeeIds.includes(p.id));
      } else {
        return this.$store.state.people.people.filter(p => !this.attendeeIds.includes(p.id));
      }
    },
    filteredAttendeesOne() {
      if (!this.attendee_2) {
        return this.attendees.filter(a => !this.coupleIds.includes(a.id));
      } else {
        return this.attendees.filter(a => a.id !== this.attendee_2.id && !this.coupleIds.includes(a.id));
      }
    },
    filteredAttendeesTwo() {
      if (!this.attendee_1) {
        return this.attendees.filter(a => !this.coupleIds.includes(a.id));
      } else {
        return this.attendees.filter(a => a.id !== this.attendee_1.id && !this.coupleIds.includes(a.id));
      }
    },
    headers() {
      return [
        {
          text: i18n.t("classes.attendees.headers.full_name"),
          value: "full_name"
        },
        {
          text: i18n.t("classes.attendees.headers.email"),
          value: "email"
        },
        {
          text: i18n.t("classes.attendees.headers.student_number"),
          value: "student_number"
        },
        {
          text: i18n.t("classes.attendees.headers.notes"),
          value: "notes"
        },
        {
          value: "action",
          align: "right"
        }
      ];
    },
    couples() {
      return this.dancing_class ? this.dancing_class.couples : [];
    },
    coupleIds() {
      return this.couples.map(c => [c.lead.id, c.follow.id]).flat();
    },
    coupleHeaders() {
      return [
        {
          text: i18n.t("classes.attendees.headers.full_name"),
          value: "lead.full_name"
        },
        {
          text: i18n.t("classes.attendees.headers.full_name"),
          value: "follow.full_name"
        },
        {
          value: "action",
          align: "right"
        }
      ];
    },
    filteredCouples() {
      if (this.dancing_class) {
        return this.$store.state.couples.couples.filter(
          c => !this.dancing_class.person_ids.includes(c.lead.id) && !this.dancing_class.person_ids.includes(c.lead.id)
        );
      } else {
        return this.$store.state.couples.couples;
      }
    }
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios
        .get(`dancing_class/${this.$route.params.id}`)
        .then(response => {
          this.dancing_class = response.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openModal() {
      this.addAttendeeModal = true;
      this.$store.dispatch(PEOPLE);
    },
    clearData() {
      this.edit = false;
      this.person = null;
      this.notes = "";
      this.attendee_1 = null;
      this.attendee_2 = null;
      this.couple = null;
      this.dancing_class_couple = null;
      this.attendee_id = 0;
      this.dancing_class_person = null;
    },
    setEditAttendee(attendee) {
      this.edit = true;
      this.openModal();
      this.dancing_class_person = attendee;
      this.attendee_id = attendee.person.id;
      this.person = attendee.person.id;
      this.notes = attendee.notes;
    },
    addAttendee() {
      if (this.edit) {
        this.$store
          .dispatch(CLASSES_EDIT_ATTENDEE, {
            id: this.dancing_class.id,
            dancing_class_person_id: this.dancing_class_person.id,
            person_id: this.person,
            notes: this.notes
          })
          .then(response => {
            this.dancing_class = response.data;
            this.$toast.success(i18n.t("classes.add_attendee.updated"));
            this.clearData();
          });
      } else {
        this.$store
          .dispatch(CLASSES_ADD_ATTENDEE, { id: this.dancing_class.id, person_id: this.person, notes: this.notes })
          .then(response => {
            this.dancing_class = response.data;
            this.$toast.success(i18n.t("classes.add_attendee.added"));
            this.clearData();
          });
      }
    },
    setDeleteAttendee(attendee) {
      this.deleteAttendeeModal = true;
      this.person = attendee.id;
    },
    deleteAttendee() {
      this.$store
        .dispatch(CLASSES_DELETE_ATTENDEE, { id: this.dancing_class.id, dancing_class_person_id: this.person })
        .then(response => {
          this.dancing_class = response.data;
          this.$toast.success(i18n.t("classes.add_attendee.deleted"));
          this.clearData();
        });
    },
    openCreateCoupleModal() {
      this.createCoupleModal = true;
    },
    createCouple() {
      this.$store
        .dispatch(CLASSES_CREATE_COUPLE, {
          id: this.dancing_class.id,
          person_id: this.attendee_1.id,
          partner_id: this.attendee_2.id
        })
        .then(response => {
          this.dancing_class = response.data;
          this.$toast.success(i18n.t("classes.create_couple.created"));
          this.clearData();
        });
    },
    openAddCoupleModal() {
      this.addCoupleModal = true;
      this.$store.dispatch(COUPLES);
    },
    addCouple() {
      this.$store
        .dispatch(CLASSES_ADD_COUPLE, {
          id: this.dancing_class.id,
          couple_id: this.couple_id
        })
        .then(response => {
          this.dancing_class = response.data;
          this.$toast.success(i18n.t("classes.add_couple.added"));
          this.clearData();
        });
    },
    setDeleteCouple(couple) {
      this.deleteCoupleModal = true;
      this.couple = couple;
    },
    deleteCouple() {
      this.$store
        .dispatch(CLASSES_DELETE_COUPLE, { id: this.dancing_class.id, dancing_class_couple_id: this.couple.id })
        .then(response => {
          this.dancing_class = response.data;
          this.$toast.success(i18n.t("classes.add_couple.deleted"));
          this.clearData();
        });
    }
  },
  watch: {
    "$route.params.id": function() {
      this.getData();
    }
  }
};
</script>
