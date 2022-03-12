<style lang="scss" scoped>
.settings-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .sign-in-with-google {
    width: min(480px, 100% - 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 12px;
    border: 1px solid #666;
    background: transparent;
    border-radius: 16px;
    font-size: 18px;
    filter: none !important;
  }
  .switch-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: min(480px, 100% - 32px);
    height: 60px;
    border-left: 0;
    border-right: 0;
    border-top: 1px;
    border-bottom: 1px;
    border-style: solid;
    border-color: #666;
    label {
      font-weight: 500;
      font-size: 16px;
    }
  }
  .input-container {
    height: 45px;
    width: min(480px, 100% - 32px);
    display: flex;
    align-items: center;
    justify-content: center;
    input,
    select {
      height: 100%;
      width: 100%;
      padding: 12px;
      border-radius: 16px 0 0 16px;
      border: 1px solid #666;
      outline: none;
    }
    select {
      border-radius: 16px;
      cursor: pointer;
    }
    > div {
      height: 100%;
      padding: 12px;
      display: grid;
      place-items: center;
      border-top: 1px;
      border-bottom: 1px;
      border-right: 1px;
      border-left: 0;
      border-color: #666;
      border-style: solid;
      border-radius: 0 16px 16px 0;
      white-space: nowrap;
    }
  }
}
</style>

<script lang="ts">
import Icon from "@iconify/svelte";
import SettingsTopbar from "./components/SettingsTopbar.svelte";
import { userPreferences, ChangeUserPreference } from "@/utils/userPreferences";
import { locale, _ } from "svelte-i18n";
import { authStore, signInWithGoogle, signOutFunction } from "@/store/auth";
import type { User } from "firebase/auth";
import { streakStore } from "@/store/streak";

let langPref = "pt";
let allowVibration = false;
let enableDarkMode = false;
let haveUser = false;
let user = null as User | null;

authStore.subscribe((val) => {
  haveUser = val.haveUser;
  user = val.user;
});

function changeLang(e: Event) {
  langPref = (e.target as HTMLInputElement).value;
  ChangeUserPreference.lang(
    (e.target as HTMLInputElement).value as "pt" | "en"
  );
  locale.set((e.target as HTMLInputElement).value);
}

function changeVibration() {
  allowVibration = !allowVibration;
  ChangeUserPreference.vibration(allowVibration);
}

function changeTheme() {
  enableDarkMode = !enableDarkMode;
  if (enableDarkMode) {
    ChangeUserPreference.theme("dark");
  } else {
    ChangeUserPreference.theme("light");
  }
}

$: {
  langPref = userPreferences.lang;
  allowVibration = userPreferences.vibration;
  enableDarkMode = userPreferences.theme === "dark" ? true : false;
}
</script>

<SettingsTopbar />
<div class="settings-page">
  {#if !haveUser}
    <button class="sign-in-with-google" on:click="{() => signInWithGoogle()}">
      <Icon
        icon="flat-color-icons:google"
        style="width: 32px !important; height: 32px !important;" />
      {$_("settings.sync_your_data_with_google")}
    </button>
    <br />
    <br />
    <h3>{$_("settings.set_your_breathing_streak_goal")}</h3>
    <small>{$_("settings.not_working_yet")}!</small>
  {/if}
  {#if haveUser}
    <img
      src="{user.photoURL}"
      alt="{user.displayName} Profile picture"
      style="width: 35%; height: 35%; border-radius: 50%; object-fit: cover;" />
    <h2>{user.displayName}</h2>
    <br />
    <button
      class="btn outlined half border-red"
      on:click="{() => signOutFunction()}">
      {$_("settings.sign_out")}
    </button>
  {/if}
  {#if haveUser}
    <br />
    <div class="input-container">
      <input
        type="number"
        name="goal"
        id="goal"
        min="0"
        bind:value="{$streakStore.userGoal}"
        placeholder="{$_('settings.set_here_your_streak_goal')}" />
      <div>{$_("settings.numbers_of_days")}</div>
    </div>
    <br />
    <br />
  {/if}
  <h3>{$_("settings.change_your_app_language")}</h3>
  <br />
  <div class="input-container">
    <select on:change="{(e) => changeLang(e)}" bind:value="{langPref}">
      <option value="en">English</option>
      <option value="pt">Português</option>
    </select>
  </div>
  <br />
  <div class="switch-container">
    <label for="allow-vibration">{$_("settings.allow_vibration")}</label>
    <label class="switch">
      <input
        type="checkbox"
        id="allow-vibration"
        on:change="{(e) => changeVibration()}"
        bind:checked="{allowVibration}" />
      <span class="slider rounded"></span>
    </label>
  </div>
  <br />
  <div class="switch-container">
    <label for="enable-dark-mode">{$_("settings.enable_dark_mode")}</label>
    <label class="switch">
      <input
        type="checkbox"
        id="enable-dark-mode"
        on:change="{(e) => changeTheme()}"
        bind:checked="{enableDarkMode}" />
      <span class="slider rounded"></span>
    </label>
  </div>
</div>
