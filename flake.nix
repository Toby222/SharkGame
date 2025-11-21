{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];
      forEachSupportedSystem =
        f:
        nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            pkgs = import nixpkgs {
              inherit system;
            };
          }
        );
    in
    {
      formatter = forEachSupportedSystem (
        { pkgs, ... }: pkgs.writeShellScriptBin "format" "${pkgs.bun}/bin/bun run fix"
      );
      devShells = forEachSupportedSystem (
        { pkgs, ... }:
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nixd
              biome
              nixfmt-rfc-style
              nodejs_latest
            ];
            env = {
              LOG_TO_FILE = "true";
              LOG_LEVEL = "trace";
              POSTGRES_URL = "/var/run/postgresql";
            };
          };
        }
      );
      nixosModule = self.nixosModules.cosmeredle;
      nixosModules.cosmeredle =
        { config, pkgs, ... }:
        let
          cfg = config.services.cosmeredle;
        in
        {
          options.services.cosmeredle = {
            enable = pkgs.lib.mkEnableOption "cosmeredle service";
            seed = pkgs.lib.mkOption {
              default = "RANDOM_SEED";
              example = "RAnDom_s_t_rING_%91%";
              description = "An arbitrary value to make sure the daily character is unpredictable";
              type = pkgs.lib.types.str;
            };
            package = pkgs.lib.mkPackageOption pkgs "cosmeredle" {
              default = [ "cosmeredle" ];
              example = "pkgs.cosmeredle";
            };
          };

          config = {
            nixpkgs.overlays = [ self.overlays.default ];
            systemd.services.cosmeredle = pkgs.lib.mkIf cfg.enable {
              enable = cfg.enable;
              wantedBy = [ "multi-user.target" ];
              wants = [ "network-online.target" ];
              description = "Cosmeredle";
              path = [ ];
              environment = {
                RANDOM_SEED = cfg.seed;
              };

              serviceConfig = {
                Type = "simple";
                Restart = "on-failure";
                RestartSec = "5s";
                WorkingDirectory = "${cfg.package}/bin/";
                ExecStart = "${cfg.package}/bin/cosmeredle";
              };
            };
          };
        };
      overlays.default = final: prev: {
        cosmeredle = self.packages.${final.system}.default;
      };
      packages = forEachSupportedSystem (
        { pkgs, ... }:
        {
          default =
            let
              packageJSON = pkgs.lib.importJSON ./package.json;
              packageLock = pkgs.lib.importJSON ./package-lock.json;
              src = pkgs.lib.cleanSource ./.;
            in
            pkgs.buildNpmPackage {
              nodejs = pkgs.nodejs_latest;
              name = packageJSON.name;
              version = packageJSON.version;
              inherit src;
              npmDeps = pkgs.importNpmLock {
                npmRoot = src;
                version = packageJSON.version;
                pname = packageJSON.name;
                package = packageJSON;
                packageLock = packageLock;
              };
              nativeBuildInputs = with pkgs; [
                bun
              ];
              npmConfigHook = pkgs.importNpmLock.npmConfigHook;

              postBuild = ''
                mkdir -p $out/bin/
                cp ./cosmeredle $out/bin/cosmeredle
              '';
              postInstall = ''
                rm -rv $out/lib/
              '';
            };
        }
      );
    };
}
