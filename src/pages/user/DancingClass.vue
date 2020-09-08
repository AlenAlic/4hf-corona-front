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
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer />
        <div>
          <v-row class="mb-3" no-gutters justify="end">
            <v-btn color="primary" @click="openModal">{{ $t("classes.add_new_attendee.text") }}</v-btn>
          </v-row>
          <v-row no-gutters justify="end">
            <v-btn color="secondary" @click="openCoupleModal">{{ $t("classes.create_couple.text") }}</v-btn>
          </v-row>
        </div>
      </v-card-title>
      <v-tabs fixed-tabs background-color="primary" dark v-model="tabs">
        <v-tab>
          {{ $t("classes.attendees.text") }}
        </v-tab>
        <v-tab>
          {{ $t("classes.couples") }}
        </v-tab>
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
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <modal
      v-model="modal"
      v-if="modal"
      :accept="$t('general.add')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="addAttendee"
    >
      <v-card-title>{{ $t("classes.add_new_attendee.text") }}</v-card-title>
      <v-card-text>
        <v-select
          v-model="person"
          :items="people"
          persistent-hint
          :label="$t('classes.add_new_attendee.person.label')"
          :disabled="$store.state.people.loading"
          :loading="$store.state.people.loading"
          :rules="[$form.fieldRequired]"
          item-text="full_name"
          item-value="id"
          return-object
        ></v-select>
        <v-text-field
          v-model="notes"
          :label="$t('classes.add_new_attendee.notes.label')"
          persistent-hint
          :hint="$t('classes.add_new_attendee.notes.hint')"
          required
        />
      </v-card-text>
    </modal>
    <modal
      v-model="coupleModal"
      v-if="coupleModal"
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
          :label="$t('classes.add_new_attendee.person.label')"
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
          :label="$t('classes.add_new_attendee.person.label')"
          :rules="[$form.fieldRequired]"
          item-text="full_name"
          item-value="id"
          return-object
          clearable
        ></v-select>
      </v-card-text>
    </modal>
  </v-container>
  <v-container class="fill-height" fluid v-else-if="!dancing_class && loading">
    <v-row align="center" justify="center" class="text-center">
      <v-col cols="12">
        <v-progress-circular color="primary" :size="80" :width="8" indeterminate />
      </v-col>
      <v-col cols="12">
        <h3>{{ $t("general.loading") }}</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import i18n from "@/languages";
import Modal from "@/components/modal/Modal";
import { PEOPLE } from "@/store/modules/people";

export default {
  components: { Modal },
  data: function() {
    return {
      modal: false,
      search: "",
      dancing_class: null,
      loading: true,
      person: null,
      notes: "",
      coupleModal: false,
      attendee_1: null,
      attendee_2: null,
      tabs: 0
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
      return this.$store.state.people.people.filter(p => !this.attendeeIds.includes(p.id));
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
      this.modal = true;
      this.$store.dispatch(PEOPLE);
    },
    clearData() {
      this.person = null;
      this.notes = "";
      this.attendee_1 = null;
      this.attendee_2 = null;
    },
    addAttendee() {
      this.axios
        .post(`dancing_class/${this.dancing_class.id}/add_attendee`, {
          person_id: this.person.id,
          notes: this.notes
        })
        .then(response => {
          this.dancing_class = response.data;
          this.$toast.success(i18n.t("classes.add_new_attendee.added"));
          this.clearData();
        });
    },
    openCoupleModal() {
      this.coupleModal = true;
    },
    createCouple() {
      this.axios
        .post(`dancing_class/${this.dancing_class.id}/create_couple`, {
          person_id: this.attendee_1.id,
          partner_id: this.attendee_2.id
        })
        .then(response => {
          this.dancing_class = response.data;
          this.$toast.success(i18n.t("classes.create_couple.created"));
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
