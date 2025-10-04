# 📱 Guide de Déploiement Mobile - QuickMessage

## 🚀 Étapes pour créer votre application mobile

### 1️⃣ Exporter vers GitHub
1. Cliquez sur le bouton **GitHub** en haut à droite de Lovable
2. Sélectionnez **"Connect to GitHub"**
3. Autorisez l'application Lovable GitHub
4. Cliquez sur **"Create Repository"**

### 2️⃣ Cloner et préparer le projet
```bash
# Cloner votre repository
git clone <VOTRE_URL_GITHUB>
cd <NOM_DU_PROJET>

# Installer les dépendances
npm install

# Initialiser Capacitor (si pas déjà fait)
npx cap init
```

### 3️⃣ Ajouter les plateformes

#### Pour Android 🤖
```bash
# Ajouter Android
npx cap add android

# Mettre à jour les dépendances natives
npx cap update android

# Builder le projet web
npm run build

# Synchroniser avec Android
npx cap sync android

# Ouvrir dans Android Studio
npx cap open android
```

**Dans Android Studio:**
1. Attendez que Gradle sync termine
2. Connectez votre téléphone ou lancez un émulateur
3. Cliquez sur ▶️ Run pour tester
4. Pour créer l'APK: Build → Build Bundle(s) / APK(s) → Build APK(s)

#### Pour iOS 🍎 (nécessite un Mac)
```bash
# Ajouter iOS
npx cap add ios

# Mettre à jour les dépendances natives
npx cap update ios

# Builder le projet web
npm run build

# Synchroniser avec iOS
npx cap sync ios

# Ouvrir dans Xcode
npx cap open ios
```

**Dans Xcode:**
1. Connectez votre iPhone
2. Sélectionnez votre appareil
3. Cliquez sur ▶️ pour tester
4. Pour publier: Product → Archive

### 4️⃣ Configuration des permissions

#### Android (`android/app/src/main/AndroidManifest.xml`)
```xml
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.CALL_PHONE" />
<uses-permission android:name="android.permission.INTERNET" />
```

#### iOS (`ios/App/App/Info.plist`)
```xml
<key>NSContactsUsageDescription</key>
<string>QuickMessage a besoin d'accéder à vos contacts pour vous permettre de les appeler directement.</string>
<key>NSPhoneCallUsageDescription</key>
<string>QuickMessage a besoin d'accéder au téléphone pour passer des appels.</string>
```

## 🔄 Développement continu

Après chaque modification dans Lovable:
```bash
# Récupérer les dernières modifications
git pull

# Rebuilder et synchroniser
npm run build
npx cap sync
```

## 📦 Distribution

### Android - Google Play Store
1. Créez un compte développeur Google Play (25$ unique)
2. Générez un APK signé ou un App Bundle
3. Téléchargez sur Google Play Console

### iOS - Apple App Store
1. Inscrivez-vous au Apple Developer Program (99$/an)
2. Créez un certificat de distribution
3. Archivez et téléchargez via Xcode

## ⚡ Fonctionnalités natives activées

✅ Accès aux contacts du téléphone
✅ Appels téléphoniques directs
✅ Notifications push (à configurer)
✅ Optimisations tactiles mobiles
✅ Mode sombre/clair automatique
✅ Interface plein écran

## 🆘 Dépannage

**Erreur "Platform not found":**
```bash
npx cap add android
# ou
npx cap add ios
```

**Erreur de build:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
npx cap sync
```

**Contacts ne se chargent pas:**
- Vérifiez les permissions dans AndroidManifest.xml / Info.plist
- Accordez les permissions manuellement dans les paramètres de l'appareil

## 📱 Test en développement

L'app utilise le hot-reload configuré dans `capacitor.config.json`:
- L'app mobile se connecte automatiquement à votre sandbox Lovable
- Les modifications dans Lovable se reflètent instantanément sur mobile
- Parfait pour le développement rapide!

Pour désactiver en production, supprimez la section `server` du `capacitor.config.json`.

---

🎉 **Votre application mobile est prête à être déployée!**
