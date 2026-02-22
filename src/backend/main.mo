import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Backend state for storing user configurations (if persistence is needed)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type TimelineConfiguration = {
    timelineLayout : Text;
    defaultZoomLevel : Nat;
    // Add other persistent settings fields as needed
  };

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  let userConfigurations = Map.empty<Principal, TimelineConfiguration>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  public shared ({ caller }) func saveUserConfiguration(config : TimelineConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save configurations");
    };
    userConfigurations.add(caller, config);
  };

  public query ({ caller }) func getUserConfiguration() : async ?TimelineConfiguration {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access configurations");
    };
    userConfigurations.get(caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
