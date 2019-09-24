<template>
  <div>
    <v-layout white>
      <v-flex xs12 sm6 md5 class="d-none d-sm-flex">
        <v-img :src="require('~/assets/me.jpg')" height="100vh"/>
      </v-flex>
      <v-flex xs12 sm6 md7 class="profile d-flex flex-column">
        <v-img :src="require('~/assets/me-mobile.jpg')" height="40vh" class="d-flex d-sm-none"/>
        <div class="intro pl-12 pr-12">
          <h1>Thibaut Mottet</h1>
          <h2 class="mb-0">Craftsman and full stack web developer</h2>
          <div class="description mt-3"><p>Hey there, I am Thibaut from Paris. I am a full stack web developer and lead
            tech but above all, I am a
            craftsman.</p></div>
          <div class="tag">
            <ul>
              <li>#DDD</li>
              <li>#TDD</li>
              <li>#CI</li>
              <li>#CD</li>
              <li>#Agile</li>
              <li>#Hexagonal</li>
              <li>#CQRS</li>
              <li>#Kotlin</li>
              <li>#Firebase</li>
              <li>#Nuxt</li>
              <li>#Android</li>
              <li>#SwiftUI</li>
              <li>#Docker</li>
            </ul>
          </div>
        </div>
        <div class="link pt-4 pl-12 pr-12">
          <ul>
            <li>
              <a title="Visit me on Twitter" href="https://twitter.com/moifort_" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                  <path
                    d="M1000 500c0 277-223 500-500 500s-500-223-500-500 223-500 500-500 500 223 500 500zm-125-183c-25 11-53 18-82 22 30-17 51-45 61-79-28 17-57 28-89 35-25-28-62-45-103-45-78 0-141 63-141 142 0 10 1 22 3 32-118-5-223-62-294-149-11 22-18 46-18 72 0 50 24 93 62 118-23 0-45-7-64-18v2c0 69 49 126 114 140-12 3-24 4-37 4-9 0-19-1-27-2 18 57 71 95 132 96-48 38-108 65-176 65-11 0-23-1-33-2 62 40 138 62 217 62 262 0 404-216 404-404v-18c28-19 51-45 71-73z"/>
                </svg>
              </a>
            </li>
            <li>
              <a title="Visit me on LinkedIn" href="https://www.linkedin.com/in/thibaut-mottet-9199b2107"
                 target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                  <path
                    d="M1000 500c0 277-223 500-500 500s-500-223-500-500 223-500 500-500 500 223 500 500zm-625-240c-1-41-32-73-83-73-50 0-83 32-83 73s32 73 82 73h1c51 0 83-32 83-73zm-21 136h-125v354h125v-354zm458 166c0-114-56-187-146-187-50 0-87 30-104 75l-4-54h-124c1 13 3 83 3 83v271h125v-188c0-50 23-83 62-83 38 0 63 20 63 83v188h125v-188z"/>
                </svg>
              </a>
            </li>
            <li>
              <a title="Visit me on GitHub" href="https://github.com/moifort" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
                  <path
                    d="M1000 508c0 232-160 429-375 485v-131c0-41-10-98-52-131 134-20 239-99 239-223 0-51-21-102-58-144 11-47 17-105-4-148-53 5-106 32-145 56-33-8-67-14-105-14s-73 6-106 14c-39-24-91-51-144-56-21 43-16 101-5 148-37 42-57 93-57 144 0 124 105 203 239 223-20 15-32 36-40 57-105 2-189-81-190-81-5-4-12-5-16-2-6 3-9 10-7 16 2 5 44 124 201 172v100c-215-56-375-253-375-485 0-275 223-500 500-500 275 0 500 225 500 500z"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
        <div class="flex-grow-1 overflow-y-auto  pl-12 pr-12 timeline">
          <v-timeline dense>
            <v-timeline-item large color="white">
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="require('~/assets/avatar.jpg')"/>
                </v-avatar>
              </template>
              <v-row class="pt-1">
                <v-col xs="6">
                  <div style="font-size: 16px;"><strong>Freelance</strong></div>
                  <div class="caption">Now</div>
                </v-col>
                <v-col class="text-right" xs="6">
                  <v-btn color="#305b90" class="d-sm-none" fab dark href="mailto:thibaut.mottet@gmail.com">
                    <v-icon dark>mdi-email</v-icon>
                  </v-btn>
                  <a class="button d-none d-sm-inline-block" href="mailto:thibaut.mottet@gmail.com">Contact Me</a>
                </v-col>
              </v-row>
            </v-timeline-item>
            <v-timeline-item large color="white">
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="require('~/assets/pupscan.png')"/>
                </v-avatar>
              </template>
              <v-row class="pt-1">
                <v-col sm="12" md="6">
                  <div style="font-size: 16px;"><strong>CTO</strong> of <a href="http://pupscan.com" target="_blank">pupscan.com</a>
                  </div>
                  <div class="caption">From Jun. 2017 to Nov. 2018</div>
                </v-col>
                <v-col class="text-right  d-none d-md-block">
                  <FirebaseLogo/>
                  <AndroidLogo/>
                  <NuxtLogo/>
                </v-col>
              </v-row>
            </v-timeline-item>
            <v-timeline-item large color="white">
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="require('~/assets/sg.png')"/>
                </v-avatar>
              </template>
              <v-row class="pt-1">
                <v-col sm="12" md="6">
                  <div style="font-size: 16px;"><strong>Web developer</strong> at Société Générale</div>
                  <div class="caption">From Sept. 2016 to May 2017</div>
                </v-col>
                <v-col class="text-right  d-none d-md-block">
                  <KotlinLogo/>
                  <SpringLogo/>
                  <AxonLogo/>
                </v-col>
              </v-row>
            </v-timeline-item>
            <v-timeline-item large color="white">
              <template v-slot:icon>
                <v-avatar>
                  <v-img :src="require('~/assets/alantaya.png')"/>
                </v-avatar>
              </template>
              <v-row class="pt-1">
                <v-col sm="12" md="6">
                  <div style="font-size: 16px;"><strong>CTO</strong> of <a href="https://alantaya.com" target="_blank">alantaya.com</a>
                  </div>
                  <div class="caption">From Sept. 2014 to Aug. 2016</div>
                </v-col>
                <v-col class="text-right  d-none d-md-block">
                  <JHipsterLogo/>
                  <SpringLogo/>
                  <DockerLogo/>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
    import FirebaseLogo from '~/components/FirebaseLogo'
    import NuxtLogo from '~/components/NuxtLogo'
    import AndroidLogo from '~/components/AndroidLogo'
    import SwiftUILogo from '~/components/SwiftUILogo'
    import KotlinLogo from '~/components/KotlinLogo'
    import SpringLogo from '~/components/SpringLogo'
    import AxonLogo from "~/components/AxonLogo"
    import JHipsterLogo from "~/components/JHipsterLogo"
    import DockerLogo from "~/components/DockerLogo"

    export default {
        components: {
            DockerLogo,
            JHipsterLogo,
            AxonLogo,
            FirebaseLogo,
            NuxtLogo,
            AndroidLogo,
            SwiftUILogo,
            KotlinLogo,
            SpringLogo,
        },
    }
</script>

<style scoped>
  .profile {
    padding-top: 48px;
    height: 100vh;
    overflow: hidden;
  }

  .profile p {
    font-size: 16px;
    line-height: 22px;
  }


  .profile .tag ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .profile .tag ul > li {
    margin-left: 0;
    margin-right: 10px;
    font-size: 14px;
    color: #9f9f9f;
  }

  .profile .link ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
  }

  .profile .link ul > li {
    margin-left: 0;
    margin-right: 10px;
  }

  .profile .link ul > li svg {
    font-size: 30px;
    fill: rgba(54, 71, 78, .7);
    width: 36px;
  }

  .profile .work {
    margin: 25px 0;
  }

  .profile .work .title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  .profile .v-timeline-item {
    padding-bottom: 13px;
  }

  .button {
    text-decoration: none;
    background-color: #305b90;
    color: #fff;
    border: 1px solid rgba(0, 0, 0, .1);
    font-size: 16px;
    line-height: 38px;
    padding: 0 20px;
    display: inline-block;
    text-align: center;
    border-radius: 5px;
    box-sizing: border-box;
    white-space: nowrap;
    user-select: none;
    cursor: pointer;
    font-weight: bold;
    width: 130px;
  }

  @media screen and (min-width: 1200px) {

    .v-application .link {
      padding-left: 100px !important;
      padding-right: 100px !important;
    }

    .v-application .timeline {
      padding-left: 100px !important;
      padding-right: 100px !important;
    }

    .profile .intro {
      padding-left: 100px !important;
      padding-right: 100px !important;
    }
  }

  @media screen and (max-width: 600px) {
    .profile {
      padding-top: 0px;
      height: auto;
      overflow: auto;
    }

    .v-application .link {
      padding-left: 15px !important;
      padding-right: 15px !important;
    }

    .v-application .timeline {
      padding-left: 15px !important;
      padding-right: 15px !important;
    }

    .profile .intro {
      padding-top: 10px;
      text-align: center;
      padding-left: 15px !important;
      padding-right: 15px !important;
    }

  }
</style>
