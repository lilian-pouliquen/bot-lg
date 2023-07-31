# Required permissions to use Bot-lg <!-- omit in toc -->

## 1. Bot-lg app permissions

* Manage Roles
* Manage Channels
* Read messages/View Channels
* Send Messages
* Manage Messages
* Embed Links
* Read Message History
* Add Reactions
* Use Slash Commands
* Mute Members
* Priority Speaker

Permission integer: 2420206928
Scopes: applications.commands, bot

## 2. Role permissions

The listed permissions are the one that are not already granted to the default `@everyone`.

### 2.1. Game Master

* Manage Roles
* Mute Members
* Priority Speaker

### 2.2. Game roles

Same as `@everyone`.

## 3. Text channel permissions

### 3.1. Game role channels

#### 3.1.1. Linked game roles (ie.: role `Villager` for channel `Villager`, etc.), `Game master`

Allow:

* Read Messages/View Vhannels
* Send Messages

#### 3.1.2. Role `@everyone`

Deny:

* Read Messages/View Vhannels
* Send Messages

### 3.2. Channel `Village`

#### 3.2.1. Game roles

Allow:

* Read Messages/View Vhannels
* Send Messages

#### 3.2.2. Roles `Muted`, `Dead`

Allow:

* Read Messages/View Vhannels

Deny:

* Send Messages

#### 3.2.3. Role `@everyone`

Deny:

* Read Messages/View Vhannels
* Send Messages

### 3.3. Channel `Dead`

#### 3.3.1. Roles `Dead`, `Game master`

Allow:

* Read Messages/View Vhannels
* Send Messages

#### 3.3.2. Role `Shaman`

Allow:

* Read Messages/View Vhannels

Deny:

* Send Messages

#### 3.3.3. Role `@everyone`

Deny:

* Read Messages/View Vhannels
* Send Messages

### 3.4. Channel `Werewolf`

#### 3.4.1. Roles `Werewolf`, `White werewolf`, `Infected werewolf`, `Infected`, `Game master`

Allow:

* Read Messages/View Vhannels
* Send Messages

#### 3.4.2. Role `@everyone`

Deny:

* Read Messages/View Vhannels
* Send Messages

## 4. Voice channel permissions

### 4.1. Role `Muted`

Deny:

* Speak

## 5. Command permissions

### 5.1. nettoyer

* Administrator

### 5.2. roles

* Send Messages
* Embed Links
* Use Slash Commands

### 5.3. minuteur

* Send Messages
* Use Slash Commands

### 5.4. assigner, terminer

* Manage Roles
* Send Messages
* Use Slash Commands

### 5.5. commencer

* Manage Roles
* Send Messages
* Embed Links
* Use Slash Commands

### 5.6. soleil

* Manage Roles
* Send Messages
* Use Slash Commands
* Mute Members

### 5.7. vote

* Send Messages
* Embed Links
* Add Reactions
* Use Slash Commands

### 5.8. initialiser

* Administrator
