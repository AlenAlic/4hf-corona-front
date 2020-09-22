<template>
  <v-container>
    <v-card>
      <v-card-title>
        {{ $t("general.classes") }}
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('general.search')"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer />
        <v-row no-gutters justify="end">
          <v-btn color="primary" class="my-3" @click="modal = true">{{ $t("classes.add_new_class.text") }}</v-btn>
        </v-row>
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
              <v-icon class="mr-3" v-on="on" @click="setEditClass(item)">
                mdi-pencil
              </v-icon>
            </template>
            <span>{{ $t("general.edit") }}</span>
          </v-tooltip>
          <v-tooltip left v-if="$store.getters.isAdmin || $store.getters.isBoard">
            <template v-slot:activator="{ on }">
              <v-icon class="mr-3" v-on="on" @click="setDeleteClass(item)">
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
    <modal
      v-model="deleteModal"
      :title="$t('classes.delete_class.title')"
      :text="$t('classes.delete_class.text')"
      :accept="$t('general.delete')"
      :close="$t('general.cancel')"
      @close="clearData"
      @agree="deletePerson"
    ></modal>
  </v-container>
</template>

<script>
import Modal from "@/components/modal/Modal";
import VDatetimePicker from "@/components/Vuetify/VDatetimePicker";
import { CREATE_CLASS, EDIT_CLASS, DELETE_CLASS } from "@/store/modules/classes";
import i18n from "@/languages";

export default {
  components: { VDatetimePicker, Modal },
  data: function() {
    return {
      modal: false,
      edit: false,
      search: "",
      id: null,
      name: "",
      datetime: "",
      deleteModal: false
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
      this.edit = false;
      this.id = null;
      this.name = "";
      this.datetime = "";
    },
    setEditClass(dancing_class) {
      this.edit = true;
      this.id = dancing_class.id;
      this.name = dancing_class.name;
      this.datetime = this.$util.dateTimeString(dancing_class.datetime);
      this.modal = true;
    },
    createClass() {
      if (this.edit) {
        this.$store.dispatch(EDIT_CLASS, { id: this.id, name: this.name, datetime: this.datetime }).then(id => {
          this.$toast.success(i18n.t("classes.updated"));
          this.$socket.client.emit("dancing_class_updated", id);
          this.clearData();
        });
      } else {
        this.$store.dispatch(CREATE_CLASS, { name: this.name, datetime: this.datetime }).then(() => {
          this.$toast.success(i18n.t("classes.created"));
          this.$socket.client.emit("dancing_class_created");
          this.clearData();
        });
      }
    },
    setDeleteClass(dancing_class) {
      this.deleteModal = true;
      this.id = dancing_class.id;
    },
    deletePerson() {
      this.$store.dispatch(DELETE_CLASS, { id: this.id }).then(id => {
        this.$toast.success(i18n.t("classes.deleted"));
        this.$socket.client.emit("dancing_class_deleted", id);
        this.clearData();
      });
    }
  }
};
</script>
