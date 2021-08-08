<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            class="new-content"
            v-model="newContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img
                  src="https://www.xtra.com.my/wp-content/uploads/2018/09/17.7.jpg"
                />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewPost"
            :disable="!newContent"
            class="q-mb-lg"
            unelevated
            no-caps
            rounded
            color="primary"
            label="Post"
          />
        </div>
      </div>
      <q-separator class="divider" size="10px" color="grey-2" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="posted q-py-md" v-for="post in posts" :key="post.id">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img
                  src="https://1.bp.blogspot.com/-vlWvhdD7Ufo/XP3ctHjAmuI/AAAAAAAA_Nc/Kt9r1tDv6aww-knX7pjTYxdbTkmD0KeGgCLcBGAs/s1600/hannah-delisha-30-pesanan-suara-2019.jpg"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1"
                ><strong>Hannah Delisha</strong>
                <span class="text-grey-6">
                  @hannah_delisha
                  <br class="lt-md">&bull; {{ post.date | relativeDate }}
                </span>
              </q-item-label>

              <q-item-label class="posted-content text-body1"
                >{{ post.content }}
              </q-item-label>

              <div class="lukelance-icons row justify-between q-mt-sm">
                <q-btn flat round color="grey" icon="far fa-comment" size="sm" />
                <q-btn flat round color="grey" icon="fas fa-retweet" size="sm" />
                <q-btn
                  @click="clickedLike(post)"
                  flat
                  round
                  :color="post.liked ? 'red' : 'grey'"
                  :icon="post.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm" />
                <q-btn
                  @click="deletePost(post)"
                  flat
                  round
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";

export default {
  name: "PageHome",
  data() {
    return {
      newContent: "",
      posts: [
        // {
        //   id: 'ID1',
        //   content:
        //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        //   date: 1611653238221,
        //   liked: false
        // },
        // {
        //   id: 'ID2',
        //   content:
        //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        //   date: 1611653232444,
        //   liked: true
        // }
      ]
    };
  },
  methods: {
    addNewPost() {
      let newPost = {
        content: this.newContent,
        date: Date.now(),
        liked: false
      };
      // this.posts.unshift(newPost);
      // Add a new document with a generated id.
      db.collection("posts").add(newPost).then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
      }).catch((error) => {
          console.error("Error adding document: ", error);
      });
      this.newContent = ''
    },
    deletePost(post) {
      db.collection("posts").doc(post.id).delete().then(() => {
          console.log("Document successfully deleted!");
      }).catch((error) => {
          console.error("Error removing document: ", error);
      });
    },
    clickedLike(post) {
      db.collection("posts").doc(post.id).update({
          liked: !post.liked
      })
      .then(() => {
          console.log("Document successfully updated!");
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
      });
    }
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    }
  },
  mounted() {
    db.collection("posts").orderBy('date').onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let postChange = change.doc.data()
        postChange.id = change.doc.id
          if (change.type === "added") {
              console.log("New post: ", postChange);
              this.posts.unshift(postChange)
          }
          if (change.type === "modified") {
              console.log("Modified post: ", postChange);
              let index = this.posts.findIndex(post => post.id === postChange.id)
              Object.assign(this.posts[index], postChange)
          }
          if (change.type === "removed") {
              console.log("Removed post: ", postChange);
              let index = this.posts.findIndex(post => post.id === postChange.id)
              this.posts.splice(index, 1)
          }
      });
    });
  }
};
</script>

<style lang="sass">
.new-content
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.posted:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.posted-content
  white-space: pre-line
.lukelance-icons
  margin-left: -5px
</style>
